import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Component } from 'svelte';
import { createMeta, type Field, type FieldOptions } from '../utils.svelte.ts';
import type { InputType } from '#lib/tiny/input.svelte';
import Input from './input.svelte';
import Color from './color.svelte';

export type InputField<T> = Field<T> & {
  value: string;
  onInput: (value: string) => void;
  onBlur: (value: string) => void;
  type: InputType;
};

export const createInputField = <T>({
  name,
  toString,
  fromString,
  component,
}: {
  name: string;
  toString: (value: T) => string;
  fromString: (value: string) => T;
  component: Component<{ field: InputField<T> }>;
}) => {
  return (_opts: OptionsInput<FieldOptions<T> & { type?: InputType }>): InputField<T> => {
    const opts = options(_opts);

    const property = $derived(opts.property);
    const value = $derived(toString(opts.property.value));
    const serialized = $derived(property.value);
    const onInput = (value: string) => property.update(fromString(value));
    const onBlur = (value: string) => property.update(fromString(value));
    const type = $derived(opts.type ?? 'text');
    const meta = createMeta(opts);

    return options(
      {
        component,
        property: getter(() => property),
        value: getter(() => value),
        serialized: getter(() => serialized),
        onInput,
        onBlur,
        type: getter(() => type),
        meta: getter(() => meta),
      },
      { name },
    );
  };
};

export const stringField = createInputField<string>({
  name: 'StringEditor',
  fromString: (value) => value,
  toString: (value) => value,
  component: Input,
});

export const colorField = createInputField<string>({
  name: 'ColorEditor',
  fromString: (value) => value,
  toString: (value) => value,
  component: Color,
});
