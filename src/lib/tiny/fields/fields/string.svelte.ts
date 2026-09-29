import type { InputAutocomplete, InputType } from '#lib/tiny/input.svelte';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import String from './-string.svelte';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value.svelte.ts';

type T = string;

export class StringField extends ValueField<T, T, StringFieldDefinition> {
  readonly type = $derived(this.definition.type);
  readonly rows = $derived(this.definition.rows);
  readonly autofocus = $derived(this.definition.autofocus);
  readonly autocomplete = $derived(this.definition.autocomplete);
  readonly onInput = (next: string) => this.update(next);
  protected readonly _serialized = $derived(this.value);
  protected editor = String;
}

export type StringFieldDefinitionOptions = ValueFieldDefinitionOptions<T, StringField> & {
  type?: InputType;
  autocomplete?: InputAutocomplete;
  rows?: number;
  autofocus?: boolean;
};

export class StringFieldDefinition extends ValueFieldDefinition<T, StringField, StringFieldDefinitionOptions> {
  readonly type = $derived(this.opts.type);
  readonly rows = $derived(this.opts.rows);
  readonly autofocus = $derived(this.opts.autofocus ?? false);
  readonly autocomplete = $derived(this.opts.autocomplete);

  field(opts: CreateFieldOptions): StringField {
    return new StringField({
      definition: this,
      ...opts,
    });
  }
}
