import type { OptionsInput } from '../utils/options.svelte.ts';
import Color from './color.svelte';
import type { Data } from './types.svelte.ts';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value-field.svelte.ts';

export class ColorField extends ValueField<string, ColorFieldDefinition> {
  protected editor = Color;
  readonly onInput = (next: string) => this.update(next);
}

export type ColorFieldDefinitionOptions = ValueFieldDefinitionOptions<string>;

export class ColorFieldDefinition extends ValueFieldDefinition<string, ColorFieldDefinitionOptions> {
  field(opts: OptionsInput<{ data: Data }>): ColorField {
    return new ColorField({
      definition: this,
      ...opts,
    });
  }
}
