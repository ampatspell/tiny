import type { InputType } from '../input.svelte';
import type { OptionsInput } from '../utils/options.svelte.ts';
import String from './string.svelte';
import type { Data } from './types.svelte.ts';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value-field.svelte.ts';

export class StringField extends ValueField<string, StringFieldDefinition> {
  protected editor = String;
  readonly type = $derived(this.definition.type);
  readonly onInput = (next: string) => this.update(next);
}

export type StringFieldDefinitionOptions = ValueFieldDefinitionOptions<string> & {
  type?: InputType;
};

export class StringFieldDefinition extends ValueFieldDefinition<string, StringFieldDefinitionOptions> {
  readonly type = $derived(this.opts.type ?? 'text');

  field(opts: OptionsInput<{ data: Data }>): StringField {
    return new StringField({
      definition: this,
      ...opts,
    });
  }
}
