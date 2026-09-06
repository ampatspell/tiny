import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any } from '#lib/tiny/utils/utils.js';
import { sentenceCase } from 'text-sentence-case';
import type { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';
import type { FieldsContext } from './context.svelte.ts';

export type FieldDefinitionOptions = {
  context: FieldsContext;
  key: string;
  label?: string;
  description?: string;
};

export type FieldDefinitionBuildOptions<D extends Data> = {
  definition: FieldDefinition<D, Any, Any>;
  data: D;
};

export abstract class FieldDefinition<
  D extends Data,
  T,
  F extends Field<D, T>,
  O extends FieldDefinitionOptions = FieldDefinitionOptions,
> {
  protected readonly opts: O;
  readonly key = $derived.by(() => this.opts.key);
  readonly context = $derived.by(() => this.opts.context);
  readonly label = $derived.by(() => this.opts.label ?? sentenceCase(this.key));
  readonly description = $derived.by(() => this.opts.description);

  constructor(opts: OptionsInput<O>) {
    this.opts = options(opts);
  }

  abstract field(opts: OptionsInput<FieldDefinitionBuildOptions<D>>): F;
}
