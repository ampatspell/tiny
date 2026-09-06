import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldDefinition, type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import { FieldDefinitions, type FieldDefinitionsRecord } from './definitions.svelte.ts';
import type { Factory } from './factory.svelte.ts';
import { Field, type FieldOptions } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export type ArrayFieldOptions<D, N extends Data, FDR extends FieldDefinitionsRecord<N>> = FieldOptions<D> & {
  definitions: FieldDefinitions<N, FDR>;
};

export class ArrayField<D extends Data, N extends Data, FDR extends FieldDefinitionsRecord<N>> extends Field<D, N[]> {
  private readonly opts: ArrayFieldOptions<D, N, FDR>;

  readonly definitions = $derived.by(() => this.opts.definitions);

  constructor(opts: OptionsInput<ArrayFieldOptions<D, N, FDR>>) {
    super(opts);
    this.opts = options(opts);
  }
}

export type ArrayFieldDefinitionOptions<N extends Data, FDR> = {
  key: string;
  cb: (factory: Factory<N>) => FDR;
};

export class ArrayFieldDefinition<
  D extends Data,
  N extends Data,
  FDR extends FieldDefinitionsRecord<N>,
> extends FieldDefinition<D, N[], ArrayField<D, N, FDR>> {
  private readonly opts: ArrayFieldDefinitionOptions<N, FDR>;
  readonly definitions = $derived.by(() => new FieldDefinitions<N, FDR>({ cb: getter(() => this.opts.cb) }));

  constructor(opts: OptionsInput<ArrayFieldDefinitionOptions<N, FDR>>) {
    super(opts);
    this.opts = options(opts);
  }

  build(opts: OptionsInput<FieldDefinitionBuildOptions<D>>) {
    return new ArrayField<D, N, FDR>({
      ...opts,
      definitions: getter(() => this.definitions),
    });
  }
}
