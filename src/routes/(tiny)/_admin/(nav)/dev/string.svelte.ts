import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import type { Data } from './index.svelte.ts';
import { InputField } from './input.svelte.ts';
import { ValueFieldDefinition, type Optionals, type ValueFieldDefinitionOptions } from './value.svelte.ts';

export class StringField<D extends Data = Data> extends InputField<D, string> {
  readonly string = $derived(this.value);
  readonly serialized = $derived(this.value);
  readonly onInput = (next: string) => this.update(next);
  readonly onBlur = () => {};
}

export type StringFieldDefinitionOptions = ValueFieldDefinitionOptions<string>;

export class StringFieldDefinition<D extends Data> extends ValueFieldDefinition<
  D,
  string,
  StringField<D>,
  StringFieldDefinitionOptions
> {
  buildImpl(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<string>>) {
    return new StringField<D>(opts);
  }
}
