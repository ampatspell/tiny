import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import Date from './-date.svelte';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value.svelte.ts';

type T = string;

export class DateField extends ValueField<T, T, DateFieldDefinition> {
  readonly date = $derived.by(() => {
    const value = this.value;
    if (value) {
      return Temporal.PlainDate.from(value);
    }
  });
  readonly onUpdate = (next: Temporal.PlainDate | undefined) => {
    this.update(next?.toJSON() ?? '');
  };
  protected readonly _serialized = $derived(this.value);
  protected editor = Date;
}

export type DateFieldDefinitionOptions = ValueFieldDefinitionOptions<T, DateField>;

export class DateFieldDefinition extends ValueFieldDefinition<T, DateField, DateFieldDefinitionOptions> {
  field(opts: CreateFieldOptions): DateField {
    return new DateField({
      definition: this,
      ...opts,
    });
  }
}
