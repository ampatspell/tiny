import type { OptionsInput } from '../utils/options.svelte.ts';
import { FieldDefinition } from './field-definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type { Data } from './types.svelte.ts';

export class ArrayField<T extends Data = Data> extends Field<T[], ArrayFieldDefinition<T>> {
  isRequired = false;
  isDirty = false;
  error = undefined;
  readonly serialized = $derived(this.data);
  rollback() {}
}

export class ArrayFieldDefinition<T extends Data = Data> extends FieldDefinition {
  field(opts: OptionsInput<{ data: Data }>): ArrayField<T> {
    return new ArrayField<T>({
      definition: this,
      ...opts,
    });
  }
}
