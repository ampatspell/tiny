import { type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import type { Data } from './index.svelte.ts';
import { InputField, type InputFieldOptions } from './input.svelte.ts';
import { ValueFieldDefinition, type Optionals, type ValueFieldDefinitionOptions } from './value.svelte.ts';

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

export type Shared = {
  fallback?: number;
};

export type NumberFieldOptions<D extends Data> = InputFieldOptions<D, number> & Shared;

export class NumberField<D extends Data> extends InputField<D, number, NumberFieldOptions<D>> {
  readonly fallback = $derived(this.opts.fallback ?? 0);
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
}

export type NumberFieldDefinitionOptions = ValueFieldDefinitionOptions<number> & Shared;

export class NumberFieldDefinition<D extends Data> extends ValueFieldDefinition<
  D,
  number,
  NumberField<D>,
  NumberFieldDefinitionOptions
> {
  buildImpl(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<number>>) {
    const { fallback } = this.raw;
    return new NumberField<D>({
      ...opts,
      fallback,
    });
  }
}
