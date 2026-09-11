import type { InputType } from '#lib/tiny/input.svelte';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import String from './-string.svelte';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value.svelte.ts';

type T = string;

export class StringField extends ValueField<T, T, StringFieldDefinition> {
  readonly type = $derived(this.definition.type);
  readonly autofocus = $derived(this.definition.autofocus);
  readonly onInput = (next: string) => this.update(next);
  protected readonly _serialized = $derived(this.value);
  protected editor = String;
}

export type StringFieldDefinitionOptions = ValueFieldDefinitionOptions<T, StringField> & {
  type?: InputType;
  autofocus?: boolean;
};

export class StringFieldDefinition extends ValueFieldDefinition<T, StringField, StringFieldDefinitionOptions> {
  readonly type = $derived(this.opts.type ?? 'text');
  readonly autofocus = $derived(this.opts.autofocus ?? false);

  field(opts: CreateFieldOptions): StringField {
    return new StringField({
      definition: this,
      ...opts,
    });
  }
}
