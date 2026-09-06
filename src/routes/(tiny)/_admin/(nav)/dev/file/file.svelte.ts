import type { UniversalFile } from '#lib/tiny/files.svelte.js';
import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { type FieldDefinitionBuildOptions } from '../definition.svelte.ts';
import type { Data } from '../index.svelte.ts';
import {
  ValueField,
  ValueFieldDefinition,
  type Optionals,
  type ValueFieldDefinitionOptions,
  type ValueFieldOptions,
} from '../value.svelte.ts';
import Editor from './editor.svelte';

export type Type = UniversalFile | undefined;

export type Serialized = {
  file: globalThis.File | undefined;
};

export type Shared = {
  accept: string[];
};

export type FileFieldOptions<D extends Data> = ValueFieldOptions<D, Type> & Shared;

export class FileField<D extends Data = Data> extends ValueField<D, Type, Serialized, FileFieldOptions<D>> {
  readonly serialized = $derived.by(() => {
    const { value } = this;
    return {
      file: value?.file,
    };
  });

  readonly accept = $derived(this.opts.accept);
  readonly editor = Editor;
}

export type FileFieldDefinitionOptions = ValueFieldDefinitionOptions<Type> & Shared;

export class FileFieldDefinition<D extends Data> extends ValueFieldDefinition<
  D,
  UniversalFile | undefined,
  FileField<D>,
  FileFieldDefinitionOptions
> {
  buildImpl(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<Type>>): FileField<D> {
    const { accept } = this.raw;
    return new FileField<D>({ ...opts, accept });
  }
}
