import type { InputType } from '#lib/tiny/input.svelte';
import { getter } from '#lib/tiny/utils/options.svelte.js';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import String from './-string.svelte';
import {
  SerializedValueField,
  ValueField,
  ValueFieldDefinition,
  type ValueFieldDefinitionOptions,
} from './value.svelte.ts';

export class StringField extends ValueField<string, StringFieldDefinition> {
  protected editor = String;
  readonly type = $derived(this.definition.type);
  readonly onInput = (next: string) => this.update(next);
  readonly serialized = new SerializedValueField({
    isDirty: getter(() => this.isDirty),
    value: getter(() => this.value),
  });
}

export type StringFieldDefinitionOptions = ValueFieldDefinitionOptions<string> & {
  type?: InputType;
};

export class StringFieldDefinition extends ValueFieldDefinition<string, StringFieldDefinitionOptions> {
  readonly type = $derived(this.opts.type ?? 'text');

  field(opts: CreateFieldOptions): StringField {
    return new StringField({
      definition: this,
      ...opts,
    });
  }
}
