import { Color, Input } from './imports.ts';
import { createInputField } from './input.svelte.ts';

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
