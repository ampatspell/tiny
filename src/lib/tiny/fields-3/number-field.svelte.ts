import type { OptionsInput } from '../utils/options.svelte.ts';
import Number from './number.svelte';
import type { Data } from './types.svelte.ts';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value-field.svelte.ts';

const integerToString = (number: number | undefined) => {
  if (typeof number === 'number') {
    if (!isNaN(number) && number !== Infinity) {
      return String(number);
    }
  }
  return undefined;
};

const stringToInteger = (string: string) => {
  const number = parseInt(string);
  if (!isNaN(number) && number !== Infinity) {
    return number;
  }
  return undefined;
};

type T = number;

export class NumberField extends ValueField<T, NumberFieldDefinition> {
  readonly fallback = $derived(this.definition.fallback);
  readonly string = $derived(integerToString(this.value) ?? String(this.fallback));

  readonly onInput = (next: string) => {
    const value = stringToInteger(next);
    if (value !== undefined) {
      this.update(value);
    }
  };

  readonly onBlur = (next: string) => {
    const value = stringToInteger(next) ?? this.fallback;
    this.update(value);
  };

  protected editor = Number;
}

export type NumberFieldDefinitionOptions = ValueFieldDefinitionOptions<T> & {
  fallback?: T;
};

export class NumberFieldDefinition extends ValueFieldDefinition<T, NumberFieldDefinitionOptions> {
  readonly fallback = $derived(this.opts.fallback ?? 0);

  field(opts: OptionsInput<{ data: Data }>): NumberField {
    return new NumberField({
      definition: this,
      ...opts,
    });
  }
}
