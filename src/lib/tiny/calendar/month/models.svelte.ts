import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

type MonthModelOptions = {
  date: Temporal.PlainDate | undefined;
  onUpdate: (date: Temporal.PlainDate) => void;
};

export type DateModelOptions = {
  date: Temporal.PlainDate;
  today: Temporal.PlainDate;
  selected: Temporal.PlainDate | undefined;
  onSelect: () => void;
  isCurrent: boolean;
};

export class DateModel {
  private readonly opts: DateModelOptions;

  constructor(opts: OptionsInput<DateModelOptions>) {
    this.opts = options(opts);
  }

  private readonly date = $derived.by(() => this.opts.date);
  private readonly today = $derived.by(() => this.opts.today);
  readonly isCurrent = $derived.by(() => this.opts.isCurrent);
  readonly day = $derived.by(() => this.date.day);
  readonly isToday = $derived.by(() => this.date.equals(this.today));
  readonly isSelected = $derived.by(() => {
    const selected = this.opts.selected;
    if (selected) {
      return this.date.equals(selected);
    }
    return false;
  });
  readonly onSelect = () => this.opts.onSelect();
  readonly key = $derived.by(() => this.date.toJSON());
}

export class MonthModel {
  private readonly opts: MonthModelOptions;

  constructor(opts: OptionsInput<MonthModelOptions>) {
    this.opts = options(opts);
  }

  private readonly today = $derived(Temporal.Now.plainDateISO());
  private readonly selected = $derived.by(() => this.opts.date);
  private readonly date = $derived.by(() => this.selected ?? this.today);
  private month = $derived.by(() => this.date.month);
  private year = $derived.by(() => this.date.year);
  readonly name = $derived.by(() => MONTHS[this.month]);

  readonly years = $derived.by(() => {
    const current = $derived(this.year);
    const items = $derived.by(() => {
      const items: { year: number; label: string }[] = [];
      for (let year = current - 5; year <= current + 5; year++) {
        items.push({ year, label: String(year) });
      }
      return items;
    });
    const selected = $derived(items.find((item) => item.year === current)!);
    const onSelect = (item: (typeof items)[number] | undefined) => {
      if (item) {
        this.year = item.year;
      }
    };
    return options({
      items: getter(() => items),
      selected: getter(() => selected),
      onSelect,
      isRequired: true,
    });
  });

  readonly months = $derived.by(() => {
    const current = $derived(this.month);
    const items = $derived.by(() => {
      const items: { month: number; label: string }[] = [];
      for (let month = 1; month <= 12; month++) {
        items.push({ label: MONTHS[month - 1], month });
      }
      return items;
    });
    const selected = $derived(items.find((item) => item.month === current)!);
    const onSelect = (item: (typeof items)[number] | undefined) => {
      if (item) {
        this.month = item.month;
      }
    };

    const delta = (months: number) => {
      const { year, month } = Temporal.PlainDate.from({
        year: this.year,
        month: this.month,
        day: 1,
      }).add({
        months: months,
      });

      this.year = year;
      this.month = month;
    };

    const prev = () => delta(-1);
    const next = () => delta(+1);

    return options({
      items: getter(() => items),
      selected: getter(() => selected),
      onSelect,
      prev,
      next,
      isRequired: true,
    });
  });

  private readonly firstDay = $derived.by(() => {
    const { year, month } = this;
    return Temporal.PlainDate.from({ year, month, day: 1 });
  });

  readonly days = $derived.by(() => {
    const { date } = this;
    const columns = [];
    const dayOfWeek = date.dayOfWeek;
    const days = date.subtract({ days: dayOfWeek - 1 });
    for (let i = 0; i < 7; i++) {
      const day = days.add({ days: i });
      columns.push(DAYS[day.dayOfWeek - 1]);
    }
    return columns;
  });

  readonly grid = $derived.by(() => {
    const { year, month, firstDay, today, selected } = this;
    const daysInMonth = firstDay.daysInMonth;
    const startDayOfWeek = firstDay.dayOfWeek;
    const prevMonth = firstDay.subtract({ months: 1 });
    const prevMonthDays = prevMonth.daysInMonth;
    const leadingDaysCount = startDayOfWeek - 1;

    const grid: DateModel[] = [];
    const push = (date: Temporal.PlainDate) => {
      const onSelect = () => this.opts.onUpdate(date);
      const isCurrent = getter(() => date.year === year && date.month === month);
      grid.push(new DateModel({ date, today, selected, onSelect, isCurrent }));
    };

    {
      for (let i = leadingDaysCount - 1; i >= 0; i--) {
        const { year, month } = prevMonth;
        const day = prevMonthDays - i;
        push(Temporal.PlainDate.from({ year, month, day }));
      }
    }
    {
      for (let day = 1; day <= daysInMonth; day++) {
        push(Temporal.PlainDate.from({ year, month, day }));
      }
    }
    {
      const remainingCells = 42 - grid.length;
      const nextMonth = firstDay.add({ months: 1 });
      const { year, month } = nextMonth;
      for (let day = 1; day <= remainingCells; day++) {
        push(Temporal.PlainDate.from({ year, month, day }));
      }
    }
    return grid;
  });
}

export const useMonth = (opts: OptionsInput<MonthModelOptions>) => new MonthModel(opts);
