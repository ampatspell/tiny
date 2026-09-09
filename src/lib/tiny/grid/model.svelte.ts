import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { createContext } from 'svelte';

export type GridContextOptions = {
  models: unknown[];
  width: number | undefined;
  gap?: number;
  padding?: number;
};

export class GridContext {
  private readonly opts: GridContextOptions;
  readonly width = $derived.by(() => this.opts.width);
  readonly models = $derived.by(() => this.opts.models);
  readonly padding = $derived.by(() => this.opts.padding ?? 5);
  readonly gap = $derived.by(() => this.opts.gap ?? 3);

  constructor(opts: OptionsInput<GridContextOptions>) {
    this.opts = options(opts);
  }

  readonly columns = $derived.by(() => {
    const width = this.width;
    if (width) {
      const padding = this.padding;
      return Math.max(1, Math.floor((width - padding * 2) / 150));
    }
  });

  readonly item = $derived.by(() => {
    const { width, padding, columns, gap } = this;
    if (width && columns) {
      const w = width - 2 * padding - gap * (columns - 1);
      const size = w / columns;
      return size;
    }
  });

  readonly size = $derived.by(() => {
    const { columns, item } = this;
    const items = this.models.length;
    if (columns && items && item) {
      const rows = Math.ceil(items / columns);
      const gap = this.gap;
      const scale = (value: number) => item * value + (value - 1) * gap;
      return {
        width: scale(columns),
        height: scale(rows),
      };
    }
  });
}

const [get, set] = createContext<GridContext>();

export const setGridContext = (opts: OptionsInput<GridContextOptions>) => set(new GridContext(opts));
export const useGridContext = () => get();
