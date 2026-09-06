import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldDefinition, type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export class FileField<D extends Data> extends Field<D> {}

export class FileFieldDefinition<D extends Data> extends FieldDefinition<D, FileField<D>> {
  build(opts: OptionsInput<FieldDefinitionBuildOptions<D>>) {
    return new FileField<D>(opts);
  }
}
