import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldDefinition, type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export class StringField<D extends Data> extends Field<D> {}

export class StringFieldDefinition<D extends Data> extends FieldDefinition<D, StringField<D>> {
  build(opts: OptionsInput<FieldDefinitionBuildOptions<D>>) {
    return new StringField<D>(opts);
  }
}
