import { getter } from '#lib/tiny/utils/options.svelte.js';
import type { LocalFile, UniversalFile } from '../../files.svelte.ts';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import File from './-file.svelte';
import {
  SerializedValueField,
  ValueField,
  ValueFieldDefinition,
  type ValueFieldDefinitionOptions,
} from './value.svelte.ts';

type T = UniversalFile | undefined;

export class FileField extends ValueField<T, FileFieldDefinition> {
  readonly accept = $derived(this.definition.accept);
  readonly onSelected = (next: LocalFile | undefined) => this.update(next);
  readonly serialized = new SerializedValueField({
    isDirty: getter(() => this.isDirty),
    value: getter(() => ({ file: this.value?.file })),
  });
  protected editor = File;
}

export type FileFieldDefinitionOptions = ValueFieldDefinitionOptions<T> & {
  accept?: string[];
};

export class FileFieldDefinition extends ValueFieldDefinition<T, FileFieldDefinitionOptions> {
  readonly accept = $derived(this.opts.accept);

  field(opts: CreateFieldOptions): FileField {
    return new FileField({
      definition: this,
      ...opts,
    });
  }
}
