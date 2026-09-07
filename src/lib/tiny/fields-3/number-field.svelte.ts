import type { OptionsInput } from '../utils/options.svelte.ts';
import { FieldDefinition } from './field-definition.svelte.ts';
import type { Data } from './types.svelte.ts';
import { ValueField } from './value-field.svelte.ts';

export class NumberField extends ValueField<number, NumberFieldDefinition> {}

export class NumberFieldDefinition extends FieldDefinition {
  field(opts: OptionsInput<{ data: Data }>): NumberField {
    return new NumberField({
      definition: this,
      ...opts,
    });
  }
}
