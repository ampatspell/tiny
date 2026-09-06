import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldDefinition, type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export class NumberField<D extends Data> extends Field<D, number> {}

export class NumberFieldDefinition<D extends Data> extends FieldDefinition<D, number, NumberField<D>> {
  build(opts: OptionsInput<FieldDefinitionBuildOptions<D>>) {
    return new NumberField<D>(opts);
  }
}
