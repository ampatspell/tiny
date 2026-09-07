import { getter, options, type OptionsInput } from '../utils/options.svelte.ts';
import type { NumberKey, StringKey } from '../utils/utils.ts';

export type Data = Record<string, unknown>;

export type FieldOptions<FD extends FieldDefinition> = {
  definition: FD;
  data: Data;
};

export class Field<T = unknown, FD extends FieldDefinition = FieldDefinition> {
  private readonly opts: FieldOptions<FD>;
  private readonly data = $derived.by(() => this.opts.data);
  readonly definition = $derived.by(() => this.opts.definition);
  readonly key = $derived.by(() => this.definition.key);
  readonly external = $derived.by(() => this.data[this.key] as T);

  constructor(opts: OptionsInput<FieldOptions<FD>>) {
    this.opts = options(opts);
  }
}

export class StringField extends Field<string, StringFieldDefinition> {}
export class NumberField extends Field<number, NumberFieldDefinition> {}

export type FieldDefinitionOptions = {
  key: string;
};

export abstract class FieldDefinition {
  private readonly opts: FieldDefinitionOptions;
  readonly key = $derived.by(() => this.opts.key);

  constructor(opts: OptionsInput<FieldDefinitionOptions>) {
    this.opts = options(opts);
  }

  abstract field<D extends Data>(opts: OptionsInput<{ data: D }>): Field;
}

export class StringFieldDefinition extends FieldDefinition {
  field<D extends Data>(opts: OptionsInput<{ data: D }>): StringField {
    return new StringField({
      definition: this,
      ...opts,
    });
  }
}

export class NumberFieldDefinition extends FieldDefinition {
  field<D extends Data>(opts: OptionsInput<{ data: D }>): NumberField {
    return new NumberField({
      definition: this,
      ...opts,
    });
  }
}

export type InferFieldsDefinitionRecordFromFactory<F> = F extends Factory<Data, infer R> ? R : never;

export type InferFieldsFromDefinitionRecord<R extends Data> = {
  [K in keyof R]: InferFieldFromDefinition<R[K]>;
};

export type InferFieldFromDefinition<T> = T extends FieldDefinition ? ReturnType<T['field']> : T;

export type FieldsOptions<D extends Data, F extends Factory<D>> = {
  data: D;
  factory: F;
};

export class Fields<
  D extends Data = Data,
  F extends Factory<D, InferFieldsDefinitionRecordFromFactory<F>> = Factory<D>,
> {
  private readonly opts: FieldsOptions<D, F>;

  constructor(opts: OptionsInput<FieldsOptions<D, F>>) {
    this.opts = options(opts);
  }

  readonly data = $derived.by(() => this.opts.data);
  private readonly definition = $derived.by(() => this.opts.factory.record);

  readonly record = $derived.by(() => {
    const { definition: definitions, data } = this;
    const record: Record<string, unknown> = {};
    for (const key in definitions) {
      const definition = definitions[key];
      if (definition instanceof FieldDefinition) {
        record[key] = definition.field({ data: getter(() => data) });
      } else {
        record[key] = definition;
      }
    }
    console.log(record);
    return record as InferFieldsFromDefinitionRecord<typeof definitions>;
  });
}

export type FactoryOptions<D extends Data = Data, R extends Data = Data> = {
  cb: (factory: Factory<D>) => R;
};

export class Factory<D extends Data = Data, R extends Data = Data> {
  private readonly opts: FactoryOptions<D, R>;

  constructor(opts: OptionsInput<FactoryOptions<D, R>>) {
    this.opts = options(opts);
  }

  readonly record = $derived.by(() => this.opts.cb(this));

  readonly string = <K extends StringKey<D>>(key: K) => {
    return new StringFieldDefinition({ key });
  };

  readonly number = <K extends NumberKey<D>>(key: K) => {
    return new NumberFieldDefinition({ key });
  };
}

export type FieldsDefinitionOptions<D extends Data = Data> = {
  data: D;
};

export class FieldsDefinition<D extends Data = Data> {
  private readonly opts: FieldsDefinitionOptions<D>;

  constructor(opts: OptionsInput<FieldsDefinitionOptions<D>>) {
    this.opts = options(opts);
  }

  factory<R extends Data>(cb: (factory: Factory<D>) => R) {
    return new Factory({
      cb,
    });
  }

  define<R extends Data>(cb: (factory: Factory<D>) => R) {
    const factory = this.factory(cb);
    return new Fields({
      data: getter(() => this.opts.data),
      factory,
    });
  }
}
