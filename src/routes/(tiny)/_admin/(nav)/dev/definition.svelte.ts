import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export type FieldDefinitionOptions = {
  key: string;
};

export type FieldDefinitionBuildOptions<D extends Data> = {
  key: string;
  data: D;
};

export abstract class FieldDefinition<D extends Data, F extends Field<D>> {
  private readonly _opts: FieldDefinitionOptions;
  readonly key = $derived.by(() => this._opts.key);

  constructor(opts: OptionsInput<FieldDefinitionOptions>) {
    this._opts = options(opts);
  }

  abstract build(opts: OptionsInput<FieldDefinitionBuildOptions<D>>): F;
}
