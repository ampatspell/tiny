import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import Color from './-color.svelte';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value.svelte.ts';

type T = string;

export class ColorField extends ValueField<T, T, ColorFieldDefinition> {
  readonly onInput = (next: string) => this.update(next);
  protected readonly _serialized = $derived(this.value);
  protected readonly editor = Color;
}

export type ColorFieldDefinitionOptions = ValueFieldDefinitionOptions<T, ColorField>;

export class ColorFieldDefinition extends ValueFieldDefinition<T, ColorField, ColorFieldDefinitionOptions> {
  field(opts: CreateFieldOptions): ColorField {
    return new ColorField({
      definition: this,
      ...opts,
    });
  }
}
