import type { Data } from '#lib/tiny/properties/data.svelte.js';
import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any, ArrayKey, FileKey, NumberKey, StringKey } from '#lib/tiny/utils/utils.js';

abstract class Field<D> {}
class StringField<D> extends Field<D> {}
class NumberField<D> extends Field<D> {}
class FileField<D> extends Field<D> {}
class ArrayField<D, R extends Record<string, Field<D>>> extends Field<D> {
  constructor(public readonly fields: R) {
    super();
  }
}

abstract class FieldDefinition<D, F extends Field<D>> {
  constructor(public readonly key: string) {}

  abstract build(): F;
}

type InferFieldFromDefinition<T extends FieldDefinition<Any, Any>> =
  T extends FieldDefinition<Any, infer F> ? F : never;

type InferFieldsFromDefinitions<D extends Record<string, FieldDefinition<Any, Any>>> = {
  [K in keyof D]: InferFieldFromDefinition<D[K]>;
};

class StringFieldDefinition<D> extends FieldDefinition<D, StringField<D>> {
  build() {
    return new StringField<D>();
  }
}

class NumberFieldDefinition<D> extends FieldDefinition<D, NumberField<D>> {
  build() {
    return new NumberField<D>();
  }
}

class FileFieldDefinition<D> extends FieldDefinition<D, FileField<D>> {
  build() {
    return new FileField<D>();
  }
}

type FieldDefinitions<D> = Record<string, FieldDefinition<D, Any>>;

class ArrayFieldDefinition<D, R extends FieldDefinitions<D>> extends FieldDefinition<D, ArrayField<D, R>> {
  readonly definitions: R;

  constructor(key: string, cb: (factory: Factory<D>) => R) {
    super(key);
    this.definitions = cb(new Factory<D>());
  }

  build() {
    return new ArrayField<D, InferFieldsFromDefinitions<R>>(undefined as any);
  }
}

class Factory<D> {
  string<K extends StringKey<D>>(key: K) {
    return new StringFieldDefinition<D>(key);
  }

  number<K extends NumberKey<D>>(key: K) {
    return new NumberFieldDefinition<D>(key);
  }

  file<K extends FileKey<D>>(key: K) {
    return new FileFieldDefinition<D>(key);
  }

  array<R extends FieldDefinitions<D>, K extends ArrayKey<D, Data>, T = D[K] extends Any[] ? D[K][number] : never>(
    key: K,
    cb: (factory: Factory<T>) => R,
  ) {
    return new ArrayFieldDefinition<T, R>(key, cb);
  }
}

export const withDataFields = <D extends Data>(_opts: OptionsInput<{ data: D }>) => {
  const define = <R>(cb: (factory: Factory<D>) => R) => {
    return cb(new Factory<D>());
  };

  return {
    define,
  };
};
