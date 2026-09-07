import type { OptionsInput } from '../utils/options.svelte.ts';
import { FieldDefinition } from './field-definition.svelte.ts';
import type { Data } from './types.svelte.ts';
import { ValueField } from './value-field.svelte.ts';

export class StringField extends ValueField<string, StringFieldDefinition> {}

export class StringFieldDefinition extends FieldDefinition {
  field(opts: OptionsInput<{ data: Data }>): StringField {
    return new StringField({
      definition: this,
      ...opts,
    });
  }
}
