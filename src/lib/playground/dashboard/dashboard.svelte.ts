import { useMonth } from '#lib/tiny/calendar/month/month.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Any } from '#lib/tiny/utils/utils.js';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { createContext } from 'svelte';

export type DashboardContextOptions = {
  data: {
    files: {
      id: string;
      createdAt: string;
      name: string;
    }[];
  };
};

class DashboardDate {
  private readonly context: DashboardContext;
  readonly date: Temporal.PlainDate;

  constructor(context: DashboardContext, date: Temporal.PlainDate) {
    this.context = context;
    this.date = date;
  }

  readonly files = $derived.by(() => {
    const date = this.date;
    const files = this.context.files;
    return files?.filter((file) => file.createdAt.toPlainDate().equals(date)) ?? [];
  });
}

export class DashboardContext {
  private opts = $state<DashboardContextOptions>();
  readonly root = resolve('/(tiny)/_admin/(nav)/dashboard');

  readonly setup = (opts: OptionsInput<DashboardContextOptions>) => {
    this.opts = options(opts);
  };

  readonly data = $derived.by(() => this.opts?.data);

  readonly files = $derived.by(() => {
    return this.data?.files.map((data) => {
      const createdAt = Temporal.PlainDateTime.from(data.createdAt).toZonedDateTime('UTC').withTimeZone('Europe/Riga');
      return {
        ...data,
        createdAt,
      };
    });
  });

  readonly useMonth = (_opts: OptionsInput<{ date: Temporal.PlainDate | undefined }>) => {
    const opts = options(_opts);
    return useMonth({
      date: getter(() => opts.date),
      onUpdate: (next) => {
        if (next) {
          goto(resolve('/(tiny)/_admin/(nav)/dashboard/[date]', { date: next.toJSON() }));
        }
      },
    });
  };

  readonly createDate = (date: Temporal.PlainDate) => {
    return new DashboardDate(this, date);
  };

  readonly createOptionalDate = (date: Temporal.PlainDate | undefined) => {
    if (date) {
      return this.createDate(date);
    }
  };
}

const [get, set] = createContext<DashboardContext>();

export const setDashboardContext = () => set(new DashboardContext());
export const useDashboardContext = () => get();

export const toPlainDate = (string: string | undefined) => {
  if (string) {
    try {
      return Temporal.PlainDate.from(string);
    } catch (e: Any) {
      console.log(e?.message);
    }
  }
};
