import { type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { FieldDefinitionBuildOptions } from '../definition.svelte.ts';
import type { Data } from '../index.svelte.ts';
import { type Optionals } from '../value.svelte.ts';
import InputEditor from './input-editor.svelte';
import {
  InputField,
  InputFieldDefinition,
  type InputFieldDefinitionOptions,
  type InputFieldOptions,
} from './input.svelte.ts';

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

export class NumberField<D extends Data> extends InputField<D, number, number, NumberFieldOptions<D>> {
  readonly editor = InputEditor;
  readonly fallback = $derived(this.opts.fallback ?? 0);
  readonly string = $derived(integerToString(this.value) ?? String(this.fallback));
  readonly serialized = $derived(this.value);

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

export type NumberFieldDefinitionOptions = InputFieldDefinitionOptions<number> & Shared;

export class NumberFieldDefinition<D extends Data> extends InputFieldDefinition<
  D,
  number,
  NumberField<D>,
  NumberFieldDefinitionOptions
> {
  buildImpl(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<number>>) {
    const { fallback, type } = this.raw;
    return new NumberField<D>({
      ...opts,
      type,
      fallback,
    });
  }
}
