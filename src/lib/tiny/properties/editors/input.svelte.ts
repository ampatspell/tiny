import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import type { Component } from 'svelte';
import type { Property } from '../property.svelte.ts';
import type { Field } from './field.svelte.ts';

export type InputEditor<T> = Field<T> & {
  value: string;
  onInput: (value: string) => void;
  onBlur: (value: string) => void;
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
  component: Component<{ field: InputEditor<T> }>;
}) => {
  return (_opts: OptionsInput<{ property: Property<T> }>): InputEditor<T> => {
    const opts = options(_opts);

    const property = $derived(opts.property);
    const value = $derived(toString(opts.property.value));
    const onInput = (value: string) => property.update(fromString(value));
    const onBlur = (value: string) => property.update(fromString(value));

    return options(
      {
        component,
        property: getter(() => property),
        value: getter(() => value),
        onInput,
        onBlur,
      },
      { name },
    );
  };
};
