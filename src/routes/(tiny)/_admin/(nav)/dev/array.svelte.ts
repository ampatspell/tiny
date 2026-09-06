import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldDefinition, type FieldDefinitionBuildOptions, type FieldDefinitionOptions } from './definition.svelte.ts';
import { FieldDefinitions, type FieldDefinitionsRecord } from './definitions.svelte.ts';
import type { Factory } from './factory.svelte.ts';
import { Field, type FieldOptions } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export type ArrayFieldItemOptions<N extends Data, FDR extends FieldDefinitionsRecord<N>> = {
  data: N;
  definitions: FieldDefinitions<N, FDR>;
};

export class ArrayFieldItem<N extends Data, FDR extends FieldDefinitionsRecord<N>> {
  private readonly opts: ArrayFieldItemOptions<N, FDR>;
  readonly definitions = $derived.by(() => this.opts.definitions);
  readonly data = $derived.by(() => this.opts.data);
  readonly fields = $derived.by(() => {
    return this.definitions.fields({
      data: getter(() => this.data),
    });
  });
  readonly record = $derived(this.fields.record);

  constructor(opts: OptionsInput<ArrayFieldItemOptions<N, FDR>>) {
    this.opts = options(opts);
  }
}

export type ArrayFieldOptions<D extends Data, N extends Data, FDR extends FieldDefinitionsRecord<N>> = FieldOptions<
  D,
  N[]
> & {
  definitions: FieldDefinitions<N, FDR>;
};

export class ArrayField<D extends Data, N extends Data, FDR extends FieldDefinitionsRecord<N>> extends Field<
  D,
  N[],
  ArrayFieldOptions<D, N, FDR>
> {
  readonly definitions = $derived.by(() => this.opts.definitions);
  private _items = $derived(this.externals());
  readonly items = $derived(this._items);

  readonly isRequired = false;
  readonly error = undefined;

  readonly fields: Field[] = $derived.by(() => [this, ...this.items.map((item) => item.fields.all).flat()]);

  private externals() {
    return this.external.map((data) => {
      return new ArrayFieldItem<N, FDR>({ data, definitions: getter(() => this.definitions) });
    });
  }

  private item(data: N) {
    return new ArrayFieldItem<N, FDR>({
      data,
      definitions: getter(() => this.definitions),
    });
  }

  add(data: N) {
    this._items = [...this._items, this.item(data)];
  }
}

export type ArrayFieldDefinitionOptions<N extends Data, FDR> = FieldDefinitionOptions & {
  cb: (factory: Factory<N>) => FDR;
};

export class ArrayFieldDefinition<
  D extends Data,
  N extends Data,
  FDR extends FieldDefinitionsRecord<N>,
> extends FieldDefinition<D, N[], ArrayField<D, N, FDR>, ArrayFieldDefinitionOptions<N, FDR>> {
  readonly definitions = $derived.by(() => {
    return new FieldDefinitions<N, FDR>({
      context: getter(() => this.opts.context),
      cb: getter(() => this.opts.cb),
    });
  });

  field(opts: OptionsInput<FieldDefinitionBuildOptions<D>>) {
    return new ArrayField<D, N, FDR>({
      ...opts,
      definitions: getter(() => this.definitions),
    });
  }
}
