import type { LocalFile, UniversalFile } from '../../files.svelte.ts';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import File from './-file.svelte';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value.svelte.ts';

type T = UniversalFile | undefined;

export type SerializedFileField = {
  file: globalThis.File | undefined;
};

export class FileField extends ValueField<T, SerializedFileField, FileFieldDefinition> {
  readonly accept = $derived(this.definition.accept);
  readonly variant = $derived(this.definition.variant);
  readonly isFileRequired = $derived(this.definition.isRequired);
  readonly onSelected = (next: LocalFile | undefined) => this.update(next);
  protected readonly _serialized = $derived.by(() => {
    return {
      file: this.value?.file,
    };
  });
  protected readonly editor = File;
}

export type FileFieldDefinitionOptions = ValueFieldDefinitionOptions<T> & {
  accept?: string[];
  variant: Tiny.Thumbnail;
  isRequired?: boolean;
};

export class FileFieldDefinition extends ValueFieldDefinition<T, FileFieldDefinitionOptions> {
  readonly accept = $derived(this.opts.accept);
  readonly variant = $derived(this.opts.variant);
  readonly isRequired = $derived(this.opts.isRequired);
  field(opts: CreateFieldOptions): FileField {
    return new FileField({
      definition: this,
      ...opts,
    });
  }
}
