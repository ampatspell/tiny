import type { Property } from '../property.svelte.ts';

export type InputEditor<T> = {
  property: Property<T>;
  value: string;
  onInput: (value: string) => void;
  onBlur: (value: string) => void;
};
