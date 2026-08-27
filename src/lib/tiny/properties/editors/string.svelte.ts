import { options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import type { Property } from '../property.svelte.ts';
import type { InputEditor } from './input.svelte.ts';

export const useStringEditor = (_opts: OptionsInput<{ property: Property<string> }>): InputEditor<string> => {
  const opts = options(_opts);

  const property = $derived(opts.property);
  const value = $derived(opts.property.value);
  const onInput = (value: string) => property.update(value);
  const onBlur = (value: string) => property.update(value);

  return options(
    {
      property,
      value,
      onInput,
      onBlur,
    },
    { name: 'StringEditor' },
  );
};
