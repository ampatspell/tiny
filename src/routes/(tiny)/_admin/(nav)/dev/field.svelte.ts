import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Data } from './index.svelte.ts';

export const hashCodeTag = Symbol('hash-code');

const hasHashCodeTag = (obj: unknown) => {
  return typeof obj === 'object' && obj !== null && hashCodeTag in obj;
};

export const equals = (a: unknown, b: unknown) => {
  if (hasHashCodeTag(a) && hasHashCodeTag(b)) {
    return a[hashCodeTag] === b[hashCodeTag];
  }
  return a === b;
};

export type FieldUpdatePair<T> = { before: T; after: T };

export type FieldOptions<D> = {
  data: D;
  key: string;
  // willUpdate?: (pair: FieldUpdatePair<T>) => void;
  // didUpdate?: (pair: FieldUpdatePair<T>) => void;
};

export abstract class Field<D extends Data = Data, T = unknown> {
  private readonly _opts: FieldOptions<D>;
  readonly data = $derived.by(() => this._opts.data);
  readonly key = $derived.by(() => this._opts.key);
  readonly external = $derived.by(() => this.data[this.key] as T);
  private _value = $derived(this.external);
  readonly value = $derived(this._value);
  readonly isDirty = $derived(!equals(this.external, this.value));

  constructor(opts: OptionsInput<FieldOptions<D>>) {
    this._opts = options(opts);
  }

  readonly update = (after: T) => {
    const before = this.value;
    if (!equals(before, after)) {
      // const pair = { before, after };
      // this._opts.willUpdate?.(pair);
      this._value = after;
      // this._opts.didUpdate?.(pair);
    }
  };

  readonly rollback = () => {
    this.update(this.external);
  };
}
