import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { untrack } from 'svelte';
import type { InputField } from './field.svelte.ts';
import { Input } from '../imports.ts';
import { createMeta, type FieldOptions } from '../utils.svelte.ts';

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

export const numberField = (_opts: OptionsInput<FieldOptions<number> & { fallback?: number }>): InputField<number> => {
  const opts = options(_opts);
  const fallback = $derived(opts.fallback ?? 0);
  const property = $derived(opts.property);
  const value = $derived(integerToString(property.value) ?? '');
  const meta = createMeta(opts);

  let local = $state<string>(untrack(() => value));

  $effect(() => {
    const untracked = untrack(() => local);
    if (stringToInteger(untracked) !== undefined) {
      if (value !== untracked) {
        local = value;
      }
    }
  });

  const update = (next: string) => {
    const value = stringToInteger(next);
    property.update(value ?? fallback);
  };

  const onInput = (next: string) => {
    local = next;
    update(next);
  };

  const onBlur = (next: string) => {
    local = value;
    update(next);
  };

  return options(
    {
      component: Input,
      property: getter(() => property),
      value: getter(() => local),
      type: 'text',
      onInput,
      onBlur,
      meta,
    },
    { name: 'NumberField' },
  );
};
