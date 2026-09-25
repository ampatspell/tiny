import { options, type OptionsInput } from '../utils/options.svelte.ts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] as const;
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
};

export class DateModel {
  private readonly opts: DateModelOptions;

  constructor(opts: OptionsInput<DateModelOptions>) {
    this.opts = options(opts);
  }

  readonly day = $derived.by(() => this.opts.date.day);
  readonly isToday = $derived.by(() => this.opts.date.equals(this.opts.today));
  readonly isSelected = $derived.by(() => {
    const selected = this.opts.selected;
    if (selected) {
      return this.opts.date.equals(selected);
    }
    return false;
  });

  readonly onSelect = () => this.opts.onSelect();

  readonly key = $derived.by(() => this.opts.date.toJSON());
}

export class MonthModel {
  private readonly opts: MonthModelOptions;

  constructor(opts: OptionsInput<MonthModelOptions>) {
    this.opts = options(opts);
  }

  private readonly today = $derived(Temporal.Now.plainDateISO());
  private readonly selected = $derived.by(() => this.opts.date ?? this.today);
  private readonly year = $derived.by(() => this.selected.year);
  private readonly month = $derived.by(() => this.selected.month);
  private readonly firstDay = $derived.by(() => {
    const { year, month } = this;
    return Temporal.PlainDate.from({ year, month, day: 1 });
  });

  readonly days = $derived.by(() => {
    const { selected } = this;
    const columns = [];
    const dayOfWeek = selected.dayOfWeek;
    const days = selected.subtract({ days: dayOfWeek - 1 });
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
      grid.push(new DateModel({ date, today, selected, onSelect }));
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
