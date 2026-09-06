import type { Data } from './index.svelte.ts';
import { ValueField, type ValueFieldOptions } from './value.svelte.ts';

export type InputFieldOptions<D extends Data, T> = ValueFieldOptions<D, T> & {
  toString: (value: T) => string;
  toValue: (value: string) => T;
};

export class InputField<D extends Data = Data, T = unknown> extends ValueField<D, T, InputFieldOptions<D, T>> {
  protected toValue(value: string) {
    return this.opts.toValue(value);
  }

  protected toString(value: T) {
    return this.opts.toString(value);
  }

  readonly string = $derived(this.toString(this.value));

  readonly onInput = (next: string) => {
    this.update(this.toValue(next));
  };
}
