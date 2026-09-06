import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Data } from './index.svelte.ts';

export type FieldOptions<D> = {
  data: D;
  key: string;
};

export abstract class Field<D extends Data> {
  private readonly _opts: FieldOptions<D>;
  readonly data = $derived.by(() => this._opts.data);
  readonly key = $derived.by(() => this._opts.key);

  constructor(opts: OptionsInput<FieldOptions<D>>) {
    this._opts = options(opts);
  }
}
