import { sentenceCase } from 'text-sentence-case';
import { options, type OptionsInput } from '../utils/options.svelte.ts';
import type { FieldsContext } from './context.svelte.ts';
import type { Field } from './field.svelte.ts';
import type { Data } from './types.svelte.ts';

export type BaseFieldDefinitionOptions = {
  label?: string;
  description?: string;
};

export type FieldDefinitionOptions = {
  context: FieldsContext;
  key: string;
} & BaseFieldDefinitionOptions;

export abstract class FieldDefinition<O extends FieldDefinitionOptions = FieldDefinitionOptions> {
  protected readonly opts: O;

  readonly context = $derived.by(() => this.opts.context);
  readonly key = $derived.by(() => this.opts.key);
  readonly label = $derived.by(() => this.opts.label ?? sentenceCase(this.key));
  readonly description = $derived.by(() => this.opts.description);

  constructor(opts: OptionsInput<O>) {
    this.opts = options(opts);
  }

  abstract field(opts: OptionsInput<{ data: Data }>): Field;
}
