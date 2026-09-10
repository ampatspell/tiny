import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { createContext } from 'svelte';
import { nextObject, prevObject } from '../utils/array.ts';
import { sizeFor, type AspectRatio } from '../utils/aspect-ratio.ts';

export type Direction = 'left' | 'right' | 'up' | 'down';

export type GridContextOptions<T> = {
  selected: T | undefined;
  models: T[];
  width: number | undefined;
  gap?: number;
  padding?: number;
  aspectRatio?: AspectRatio;
};

export class GridContext<T = unknown> {
  private readonly opts: GridContextOptions<T>;
  readonly width = $derived.by(() => this.opts.width);
  readonly models = $derived.by(() => this.opts.models);
  readonly padding = $derived.by(() => this.opts.padding ?? 5);
  readonly gap = $derived.by(() => this.opts.gap ?? 3);
  readonly aspectRatio = $derived.by(() => this.opts.aspectRatio ?? '1x1');
  readonly selected = $derived.by(() => this.opts.selected);

  constructor(opts: OptionsInput<GridContextOptions<T>>) {
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
      return sizeFor(w / columns, this.aspectRatio);
    }
  });

  readonly size = $derived.by(() => {
    const { columns, item } = this;
    const items = this.models.length;
    if (columns && items && item) {
      // const rows = Math.ceil(items / columns);
      const gap = this.gap;
      const scale = (value: number) => item.width * value + (value - 1) * gap;
      return {
        width: scale(columns),
        height: 0, // scale(rows),
      };
    }
  });

  readonly navigate = (direction: Direction) => {
    if (!this.selected) {
      return this.models[0];
    }
    if (direction === 'right') {
      return nextObject(this.models, this.selected);
    } else if (direction === 'left') {
      return prevObject(this.models, this.selected);
    } else if (direction === 'down' || direction === 'up') {
      const offset = this.columns;
      if (offset) {
        const idx = this.models.indexOf(this.selected);
        if (idx !== -1) {
          let next;
          if (direction === 'down') {
            next = idx + offset;
          } else {
            next = idx - offset;
          }
          return this.models[next];
        }
      }
    }
  };
}

const [get, set] = createContext<GridContext>();

export const setGridContext = <T>(opts: OptionsInput<GridContextOptions<T>>) => {
  const context = new GridContext<T>(opts);
  set(context);
  return context;
};
export const useGridContext = () => get();
