import type { LocalFile, UniversalFile } from '../files.svelte.ts';
import type { OptionsInput } from '../utils/options.svelte.ts';
import File from './file.svelte';
import type { Data } from './types.svelte.ts';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value-field.svelte.ts';

type F = UniversalFile | undefined;

export class FileField extends ValueField<F, FileFieldDefinition> {
  readonly accept = $derived(this.definition.accept);
  readonly onSelected = (next: LocalFile | undefined) => this.update(next);
  protected editor = File;
}

export type FileFieldDefinitionOptions = ValueFieldDefinitionOptions<F> & {
  accept?: string[];
};

export class FileFieldDefinition extends ValueFieldDefinition<F, FileFieldDefinitionOptions> {
  readonly accept = $derived(this.opts.accept);

  field(opts: OptionsInput<{ data: Data }>): FileField {
    return new FileField({
      definition: this,
      ...opts,
    });
  }
}
