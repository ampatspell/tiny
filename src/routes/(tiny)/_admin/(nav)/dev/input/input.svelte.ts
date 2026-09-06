import type { Data } from '../index.svelte.ts';
import { ValueField, type ValueFieldOptions } from '../value.svelte.ts';
import Editor from './editor.svelte';

export type InputFieldOptions<D extends Data, T> = ValueFieldOptions<D, T>;

export abstract class InputField<
  D extends Data = Data,
  T = unknown,
  S = T,
  O extends InputFieldOptions<D, T> = InputFieldOptions<D, T>,
> extends ValueField<D, T, S, O> {
  abstract readonly string: string;
  abstract onInput(next: string): void;
  abstract onBlur(next: string): void;
  readonly editor = Editor;
}
