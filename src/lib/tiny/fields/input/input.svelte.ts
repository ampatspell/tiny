import type { InputType } from '#lib/tiny/input.svelte';
import type { Data } from '../index.svelte.ts';
import {
  ValueField,
  ValueFieldDefinition,
  type ValueFieldDefinitionOptions,
  type ValueFieldOptions,
} from '../value.svelte.ts';

export type Shared = {
  type?: InputType;
};

export type InputFieldOptions<D extends Data, T> = ValueFieldOptions<D, T> & Shared;

export abstract class InputField<
  D extends Data = Data,
  T = unknown,
  S = T,
  O extends InputFieldOptions<D, T> = InputFieldOptions<D, T>,
> extends ValueField<D, T, S, O> {
  readonly type = $derived(this.opts.type ?? 'text');
  abstract readonly string: string;
  abstract onInput(next: string): void;
  abstract onBlur(next: string): void;
}

export type InputFieldDefinitionOptions<T> = ValueFieldDefinitionOptions<T> & Shared;

export abstract class InputFieldDefinition<
  D extends Data,
  T,
  F extends ValueField<D, T>,
  O extends InputFieldDefinitionOptions<T> = InputFieldDefinitionOptions<T>,
> extends ValueFieldDefinition<D, T, F, O> {}
