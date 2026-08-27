import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import type { Property } from '../property.svelte.ts';

export type InputEditor<T> = {
  property: Property<T>;
  value: string;
  onInput: (value: string) => void;
  onBlur: (value: string) => void;
};

export const createBasicInputEditor = <T>({
  name,
  toString,
  fromString,
}: {
  name: string;
  toString: (value: T) => string;
  fromString: (value: string) => T;
}) => {
  return (_opts: OptionsInput<{ property: Property<T> }>): InputEditor<T> => {
    const opts = options(_opts);

    const property = $derived(opts.property);
    const value = $derived(toString(opts.property.value));
    const onInput = (value: string) => property.update(fromString(value));
    const onBlur = (value: string) => property.update(fromString(value));

    return options(
      {
        property: getter(() => property),
        value: getter(() => value),
        onInput,
        onBlur,
      },
      { name },
    );
  };
};

export const useStringEditor = createBasicInputEditor({
  name: 'StringEditor',
  fromString: (value) => value,
  toString: (value) => value,
});
