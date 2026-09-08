import { isTruthy } from '../utils/array.ts';
import { getter, options, type OptionsInput } from '../utils/options.svelte.ts';
import { Factory } from './factory.svelte.ts';
import { FieldDefinition, type FieldDefinitionOptions } from './field-definition.svelte.ts';
import { Field } from './field.svelte.ts';
import { Fields } from './fields.svelte.ts';
import type { Data, SerializedArrayItem } from './types.svelte.ts';

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

  readonly serialized = $derived.by<SerializedArrayItem<R>>(() => {
    if (this.isDeleted) {
      const id = this.data.id;
      if (!id) {
        throw new Error('id property is required for deleted items');
      }
      return {
        state: 'deleted',
        id,
      };
    } else if (this.isNew) {
      return {
        state: 'added',
        ...this.fields.serialized,
      };
    } else {
      const id = this.data.id;
      if (!id) {
        throw new Error('id property is required for updated items');
      }
      const dirty = this.fields.serialized;
      if (dirty) {
        return {
          state: 'updated',
          id,
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

  rollback() {
    this.fields.rollback();
  }

  constructor(opts: OptionsInput<ArrayFieldItemOptions<T, R>>) {
    this.opts = options(opts);
  }
}

export class ArrayField<T extends Entry = Entry, R extends Data = Data> extends Field<T[], ArrayFieldDefinition<T, R>> {
  private readonly factory = $derived(this.definition.factory);

  private _items = $derived(this.dataItems());
  readonly items = $derived(this._items);
  readonly serialized = $derived.by(() => this.items.map((item) => item.serialized).filter(isTruthy));
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
  cb: (factory: Factory<T>) => R;
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

  field(opts: OptionsInput<{ data: Data }>): ArrayField<T, R> {
    return new ArrayField<T, R>({
      definition: this,
      ...opts,
    });
  }
}
