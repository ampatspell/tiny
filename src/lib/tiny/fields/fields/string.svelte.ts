import type { InputType } from '#lib/tiny/input.svelte';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import String from './-string.svelte';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value.svelte.ts';

type T = string;

export class StringField extends ValueField<T, T, StringFieldDefinition> {
  readonly type = $derived(this.definition.type);
  readonly onInput = (next: string) => this.update(next);
  protected readonly _serialized = $derived(this.value);
  protected editor = String;
}

export type StringFieldDefinitionOptions = ValueFieldDefinitionOptions<T> & {
  type?: InputType;
};

export class StringFieldDefinition extends ValueFieldDefinition<T, StringFieldDefinitionOptions> {
  readonly type = $derived(this.opts.type ?? 'text');

  field(opts: CreateFieldOptions): StringField {
    return new StringField({
      definition: this,
      ...opts,
    });
  }
}
