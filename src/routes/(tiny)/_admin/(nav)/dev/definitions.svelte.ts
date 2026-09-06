import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any } from '#lib/tiny/utils/utils.js';
import type { FieldDefinition } from './definition.svelte.ts';
import { Factory } from './factory.svelte.ts';
import { Fields } from './fields.svelte.ts';
import type { Data } from './index.svelte.ts';

export type FieldDefinitionsRecord<D extends Data = Data> = Record<string, FieldDefinition<D, Any, Any>>;

export type InferFieldFromDefinition<D extends FieldDefinition<Any, Any, Any>> =
  D extends FieldDefinition<Any, Any, infer F> ? F : never;

export type InferFieldsFromDefinitions<R extends FieldDefinitionsRecord> = {
  [K in keyof R]: InferFieldFromDefinition<R[K]>;
};

export type FieldDefinitionsOptions<D extends Data, R> = {
  cb: (factory: Factory<D>) => R;
};

export class FieldDefinitions<D extends Data, R extends FieldDefinitionsRecord<D> = FieldDefinitionsRecord<D>> {
  private readonly opts: FieldDefinitionsOptions<D, R>;
  readonly record = $derived.by(() => this.opts.cb(new Factory<D>()));

  constructor(opts: OptionsInput<FieldDefinitionsOptions<D, R>>) {
    this.opts = options(opts);
  }

  build(opts: OptionsInput<{ data: D }>) {
    return new Fields({
      ...opts,
      definitions: this,
    });
  }
}
