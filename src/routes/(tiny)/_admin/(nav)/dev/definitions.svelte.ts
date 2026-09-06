import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any } from '#lib/tiny/utils/utils.js';
import type { FieldsContext } from './context.svelte.ts';
import type { FieldDefinition } from './definition.svelte.ts';
import { Factory } from './factory.svelte.ts';
import { Fields } from './fields.svelte.ts';
import type { Data } from './index.svelte.ts';

export type FieldDefinitionsRecord<D extends Data = Data> = Record<string, FieldDefinition<D, Any, Any> | undefined>;

export type InferFieldFromDefinition<D extends FieldDefinition<Any, Any, Any> | undefined> = D extends undefined
  ? undefined
  : D extends FieldDefinition<Any, Any, infer F>
    ? F
    : never;

export type InferFieldsFromDefinitions<R extends FieldDefinitionsRecord> = {
  [K in keyof R]: InferFieldFromDefinition<R[K]>;
};

export type InferFieldsRecordFromDefinition<
  D extends Data,
  FD extends FieldDefinitions<D>,
> = InferFieldsFromDefinitions<FD['record']>;

export type FieldDefinitionsOptions<D extends Data, R> = {
  context: FieldsContext;
  cb: (factory: Factory<D>) => R;
};

export class FieldDefinitions<D extends Data, R extends FieldDefinitionsRecord<D> = FieldDefinitionsRecord<D>> {
  private readonly opts: FieldDefinitionsOptions<D, R>;

  readonly context = $derived.by(() => this.opts.context);

  readonly factory = $derived.by(() => {
    return new Factory<D>({
      context: getter(() => this.context),
    });
  });

  readonly record = $derived.by(() => this.opts.cb(this.factory));

  constructor(opts: OptionsInput<FieldDefinitionsOptions<D, R>>) {
    this.opts = options(opts);
  }

  fields(opts: OptionsInput<{ data: D }>) {
    return new Fields({
      ...opts,
      context: getter(() => this.context),
      definitions: this,
    });
  }
}
