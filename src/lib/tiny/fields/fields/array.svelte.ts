import { isTruthy } from '#lib/tiny/utils/array.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { Factory, type FactoryCallback } from '../models/factory.svelte.ts';
import {
  FieldDefinition,
  type CreateFieldOptions,
  type FieldDefinitionOptions,
} from '../models/field-definition.svelte.ts';
import { Field } from '../models/field.svelte.ts';
import { Fields } from '../models/fields.svelte.ts';
import type { Data, SerializedDirtyArrayItem } from '../models/types.svelte.ts';

export class SerializedArrayFieldItem<T extends Entry, R extends Data> {
  private readonly item: ArrayFieldItem<T, R>;

  constructor(item: ArrayFieldItem<T, R>) {
    this.item = item;
  }

  readonly all = $derived.by(() => this.item['fields'].serialized.all);

  readonly dirty = $derived.by<SerializedDirtyArrayItem<R> | undefined>(() => {
    const item = this.item;
    if (item.isDeleted) {
      const id = item.data.id;
      if (!id) {
        throw new Error('id property is required for deleted items');
      }
      return {
        state: 'deleted',
        id,
      };
    } else if (item.isNew) {
      const all = item['fields'].serialized.all;
      return {
        state: 'added',
        ...all,
      };
    } else {
      const id = item.data.id;
      if (!id) {
        throw new Error('id property is required for updated items');
      }
      const dirty = item['fields'].serialized.dirty;
      if (dirty) {
        return {
          state: 'updated',
          id,
          ...dirty,
        };
      }
    }
  });
}

export type Entry = Data & { id?: string | undefined };

export type ArrayFieldItemOptions<T extends Entry = Entry, R extends Data = Data> = {
  isNew: boolean;
  data: T;
  factory: Factory<T, R>;
  delete: (item: ArrayFieldItem<T, R>) => void;
};

export class ArrayFieldItem<T extends Entry = Entry, R extends Data = Data> {
  private readonly opts: ArrayFieldItemOptions<T, R>;
  readonly data = $derived.by(() => this.opts.data);
  private readonly fields = $derived.by(() => {
    return new Fields({
      data: getter(() => this.data),
      factory: getter(() => this.opts.factory),
    });
  });
  readonly record = $derived(this.fields.record);
  readonly isNew = $derived.by(() => this.opts.isNew);
  private _isDeleted = $state(false);
  readonly isDeleted = $derived(this._isDeleted);
  readonly isDirty = $derived(this.fields.isDirty || this.isNew || this.isDeleted);

  readonly serialized = new SerializedArrayFieldItem(this);

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

  rollback() {
    this.fields.rollback();
  }

  constructor(opts: OptionsInput<ArrayFieldItemOptions<T, R>>) {
    this.opts = options(opts);
  }
}

export class SerializedArrayField<T extends Entry = Entry, R extends Data = Data> {
  private readonly field: ArrayField<T, R>;

  constructor(field: ArrayField<T, R>) {
    this.field = field;
  }

  readonly all = $derived.by(() => this.field.items.map((item) => item.serialized.all));
  readonly dirty = $derived.by(() => this.field.items.map((item) => item.serialized.dirty).filter(isTruthy));
}

export class ArrayField<T extends Entry = Entry, R extends Data = Data> extends Field<T[], ArrayFieldDefinition<T, R>> {
  private readonly factory = $derived(this.definition.factory);

  private _items = $derived(this.dataItems());
  readonly items = $derived(this._items);
  readonly serialized = new SerializedArrayField(this);
  readonly isDirty = $derived(!!this._items.find((item) => item.isDirty));
  readonly isRequired = false;
  readonly error = undefined;

  private item(data: T, isNew: boolean) {
    return new ArrayFieldItem<T, R>({
      isNew,
      data,
      factory: getter(() => this.factory),
      delete: (item) => this.deleteItem(item),
    });
  }

  private dataItems() {
    return this.data.map((data) => this.item(data, false));
  }

  private deleteItem(item: ArrayFieldItem) {
    this._items = this._items.filter((curr) => curr !== item);
  }

  add(data: T) {
    this._items = [...this._items, this.item(data, true)];
  }

  clear() {
    this._items.forEach((item) => item.delete());
  }

  rollback() {
    this._items = this.dataItems();
  }

  protected readonly fields: Field[] = $derived.by(() => {
    return [this, ...this.items.map((item) => item['fields']['all']).flat()];
  });

  editor = undefined;
}

export type ArrayFieldDefinitionOptions<T extends Entry, R extends Data> = FieldDefinitionOptions & {
  cb: FactoryCallback<T, R>;
};

export class ArrayFieldDefinition<T extends Entry = Entry, R extends Data = Data> extends FieldDefinition<
  ArrayFieldDefinitionOptions<T, R>
> {
  readonly factory = $derived.by(() => {
    return new Factory({
      cb: getter(() => this.opts.cb),
      context: getter(() => this.context),
    });
  });

  field(opts: CreateFieldOptions): ArrayField<T, R> {
    return new ArrayField<T, R>({
      definition: this,
      ...opts,
    });
  }
}
