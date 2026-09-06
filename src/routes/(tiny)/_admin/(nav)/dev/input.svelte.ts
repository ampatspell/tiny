import type { Data } from './index.svelte.ts';
import { ValueField, type ValueFieldOptions } from './value.svelte.ts';

export type InputFieldOptions<D extends Data, T> = ValueFieldOptions<D, T>;

export abstract class InputField<
  D extends Data = Data,
  T = unknown,
  O extends InputFieldOptions<D, T> = InputFieldOptions<D, T>,
> extends ValueField<D, T, O> {
  abstract readonly string: string;
  abstract onInput(next: string): void;
  abstract onBlur(next: string): void;
}
