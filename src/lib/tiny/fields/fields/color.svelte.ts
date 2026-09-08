import { getter } from '#lib/tiny/utils/options.svelte.js';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import Color from './-color.svelte';
import {
  SerializedValueField,
  ValueField,
  ValueFieldDefinition,
  type ValueFieldDefinitionOptions,
} from './value.svelte.ts';

export class ColorField extends ValueField<string, ColorFieldDefinition> {
  protected editor = Color;
  readonly onInput = (next: string) => this.update(next);
  readonly serialized = new SerializedValueField({
    isDirty: getter(() => this.isDirty),
    value: getter(() => this.value),
  });
}

export type ColorFieldDefinitionOptions = ValueFieldDefinitionOptions<string>;

export class ColorFieldDefinition extends ValueFieldDefinition<string, ColorFieldDefinitionOptions> {
  field(opts: CreateFieldOptions): ColorField {
    return new ColorField({
      definition: this,
      ...opts,
    });
  }
}
