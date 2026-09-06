import type { UniversalFile } from '#lib/tiny/files.svelte.js';
import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import type { Data } from './index.svelte.ts';
import { ValueField, ValueFieldDefinition, type Optionals, type ValueFieldDefinitionOptions } from './value.svelte.ts';

export type FileFieldDefinitionOptions = ValueFieldDefinitionOptions<UniversalFile | undefined> & {
  accept: string[];
};

export class FileField<D extends Data> extends ValueField<D, UniversalFile | undefined> {}

export class FileFieldDefinition<D extends Data> extends ValueFieldDefinition<
  D,
  UniversalFile | undefined,
  FileField<D>
> {
  buildImpl(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<UniversalFile | undefined>>): FileField<D> {
    return new FileField<D>(opts);
  }
}
