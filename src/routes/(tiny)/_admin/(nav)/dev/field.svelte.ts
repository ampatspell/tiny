import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { clone } from './clone.svelte.ts';
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

export type FieldOptions<D, T> = {
  data: D;
  key: string;
  willUpdate?: (pair: FieldUpdatePair<T>) => void;
  didUpdate?: (pair: FieldUpdatePair<T>) => void;
};

export abstract class Field<D extends Data = Data, T = unknown, O extends FieldOptions<D, T> = FieldOptions<D, T>> {
  protected readonly opts: O;
  readonly data = $derived.by(() => this.opts.data);
  readonly key = $derived.by(() => this.opts.key);
  readonly external = $derived.by(() => this.data[this.key] as T);

  constructor(opts: OptionsInput<O>) {
    this.opts = options(opts);
  }
}

export type ValueFieldOptions<D, T> = FieldOptions<D, T> & {
  willUpdate?: (pair: FieldUpdatePair<T>) => void;
  didUpdate?: (pair: FieldUpdatePair<T>) => void;
};

export abstract class ValueField<
  D extends Data = Data,
  T = unknown,
  O extends ValueFieldOptions<D, T> = ValueFieldOptions<D, T>,
> extends Field<D, T, O> {
  private _value = $derived(clone(this.external));
  readonly value = $derived(this._value);
  readonly isDirty = $derived(!equals(this.external, this.value));

  readonly update = (after: T) => {
    const before = this.value;
    if (!equals(before, after)) {
      const pair = { before, after };
      this.opts.willUpdate?.(pair);
      this._value = after;
      this.opts.didUpdate?.(pair);
    }
  };

  readonly rollback = () => {
    this.update(this.external);
  };
}
