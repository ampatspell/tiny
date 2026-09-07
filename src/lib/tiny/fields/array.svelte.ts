import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { isTruthy } from '../utils/array.ts';
import { FieldDefinition, type FieldDefinitionBuildOptions, type FieldDefinitionOptions } from './definition.svelte.ts';
import { FieldDefinitions, type FieldDefinitionsRecord } from './definitions.svelte.ts';
import type { Factory } from './factory.svelte.ts';
import { Field, type FieldOptions } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export type Entry = Data & { id?: string };

export type ArrayFieldItemOptions<N extends Entry, FDR extends FieldDefinitionsRecord<N>> = {
  data: N;
  definitions: FieldDefinitions<N, FDR>;
  isNew: boolean;
  delete: (item: ArrayFieldItem) => void;
};

export class ArrayFieldItem<
  N extends Entry = Entry,
  FDR extends FieldDefinitionsRecord<N> = FieldDefinitionsRecord<N>,
> {
  private readonly opts: ArrayFieldItemOptions<N, FDR>;
  private readonly definitions = $derived.by(() => this.opts.definitions);
  private readonly fields = $derived.by(() => {
    return this.definitions.fields({
      data: getter(() => this.data),
    });
  });

  readonly isNew = $derived.by(() => this.opts.isNew);
  private _isDeleted = $state(false);
  readonly isDeleted = $derived(this._isDeleted);
  readonly isDirty = $derived(this.fields.isDirty || this.isNew || this.isDeleted);

  readonly data = $derived.by(() => this.opts.data);
  readonly record = $derived(this.fields.record);

  readonly serialized = $derived.by(() => {
    const id = this.data.id;
    if (this.isDeleted) {
      return {
        id,
        state: 'deleted',
      };
    } else if (this.isNew) {
      const all = this.fields.serialized.all;
      return {
        state: 'added',
        ...all,
      };
    } else {
      const dirty = this.fields.serialized.dirty;
      if (dirty) {
        return {
          id,
          state: 'updated',
          ...dirty,
        };
      }
    }
  });

  delete() {
    if (this.isNew) {
      this.opts.delete(this);
    } else {
      this._isDeleted = true;
    }
  }

  restore() {
    this._isDeleted = false;
  }

  constructor(opts: OptionsInput<ArrayFieldItemOptions<N, FDR>>) {
    this.opts = options(opts);
  }
}

export type ArrayFieldOptions<D extends Data, N extends Entry, FDR extends FieldDefinitionsRecord<N>> = FieldOptions<
  D,
  N[]
> & {
  definitions: FieldDefinitions<N, FDR>;
};

export class ArrayField<D extends Data, N extends Entry, FDR extends FieldDefinitionsRecord<N>> extends Field<
  D,
  N[],
  unknown,
  ArrayFieldOptions<D, N, FDR>
> {
  private readonly definitions = $derived.by(() => this.opts.definitions);
  private _items = $derived(this.externals());
  readonly items = $derived(this._items);
  readonly serialized = $derived.by(() => this.items.map((item) => item.serialized).filter(isTruthy));
  protected readonly editor = undefined;

  readonly isRequired = false;
  readonly error = undefined;

  protected readonly fields: Field[] = $derived.by(() => {
    return [this, ...this.items.map((item) => item['fields']['all']).flat()];
  });

  private item(data: N, isNew: boolean) {
    return new ArrayFieldItem<N, FDR>({
      data,
      definitions: getter(() => this.definitions),
      isNew,
      delete: (item) => this.removeItem(item),
    });
  }

  private externals() {
    return this.external.map((data) => this.item(data, false));
  }

  private removeItem(item: ArrayFieldItem) {
    this._items = this._items.filter((curr) => curr !== item);
  }

  add(data: N) {
    this._items = [...this._items, this.item(data, true)];
  }

  readonly isDirty = $derived(!!this._items.find((item) => item.isDirty));

  rollback() {
    this._items = this.externals();
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
