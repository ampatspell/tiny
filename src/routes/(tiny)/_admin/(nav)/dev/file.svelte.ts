import type { UniversalFile } from '#lib/tiny/files.svelte.js';
import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldDefinition, type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export class FileField<D extends Data> extends Field<D, UniversalFile | undefined> {}

export class FileFieldDefinition<D extends Data> extends FieldDefinition<D, UniversalFile | undefined, FileField<D>> {
  build(opts: OptionsInput<FieldDefinitionBuildOptions<D>>) {
    return new FileField<D>(opts);
  }
}
