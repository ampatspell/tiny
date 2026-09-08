import { getter } from '#lib/tiny/utils/options.svelte.js';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import Number from './-number.svelte';
import {
  SerializedValueField,
  ValueField,
  ValueFieldDefinition,
  type ValueFieldDefinitionOptions,
} from './value.svelte.ts';

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

  readonly serialized = new SerializedValueField({
    isDirty: getter(() => this.isDirty),
    value: getter(() => this.value),
  });

  protected editor = Number;
}

export type NumberFieldDefinitionOptions = ValueFieldDefinitionOptions<T> & {
  fallback?: T;
};

export class NumberFieldDefinition extends ValueFieldDefinition<T, NumberFieldDefinitionOptions> {
  readonly fallback = $derived(this.opts.fallback ?? 0);

  field(opts: CreateFieldOptions): NumberField {
    return new NumberField({
      definition: this,
      ...opts,
    });
  }
}
