import { Color, Input } from './imports.ts';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import type { Component } from 'svelte';
import type { Field } from './field.svelte.ts';
import type { InputType } from '$lib/tiny/input.js';
import type { Property } from '../properties/property.svelte.ts';

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
  return (_opts: OptionsInput<{ property: Property<T>; type?: InputType }>): InputField<T> => {
    const opts = options(_opts);

    const property = $derived(opts.property);
    const value = $derived(toString(opts.property.value));
    const onInput = (value: string) => property.update(fromString(value));
    const onBlur = (value: string) => property.update(fromString(value));
    const type = $derived(opts.type ?? 'text');

    return options(
      {
        property: getter(() => property),
        value: getter(() => value),
        onInput,
        onBlur,
        type,
        component,
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
