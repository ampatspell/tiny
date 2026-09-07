import type { FieldDefinition } from './field-definition.svelte.ts';
import { Field } from './field.svelte.ts';

export class ValueField<T, D extends FieldDefinition> extends Field<T, D> {
  readonly isRequired = false;
  readonly isDirty = false;
  readonly error = undefined;
  readonly serialized = $derived(this.data);
  rollback() {}
}
