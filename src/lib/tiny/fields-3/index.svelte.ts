import { sentenceCase } from 'text-sentence-case';
import { getter, options, type OptionsInput } from '../utils/options.svelte.ts';
import type { NumberKey, StringKey } from '../utils/utils.ts';
import { FieldsContext } from './context.svelte.ts';

export type Data = Record<string, unknown>;

export type FieldOptions<FD extends FieldDefinition> = {
  definition: FD;
  data: Data;
};

export abstract class Field<T = unknown, FD extends FieldDefinition = FieldDefinition> {
  private readonly opts: FieldOptions<FD>;
  private readonly parent = $derived.by(() => this.opts.data);

  readonly definition = $derived.by(() => this.opts.definition);
  readonly context = $derived.by(() => this.definition.context);
  readonly key = $derived.by(() => this.definition.key);
  readonly data = $derived.by(() => this.parent[this.key] as T);
  readonly isTouched = $derived(this.context.isTouched);
  readonly label = $derived.by(() => this.definition.label);
  readonly description = $derived.by(() => this.definition.description);
  readonly isValid = $derived.by(() => !this.error);

  constructor(opts: OptionsInput<FieldOptions<FD>>) {
    this.opts = options(opts);
  }

  abstract readonly isRequired: boolean;
  abstract readonly isDirty: boolean;
  abstract readonly error: string | undefined;
  abstract readonly serialized: unknown;
  abstract rollback(): void;
}

export class ValueField<T, D extends FieldDefinition> extends Field<T, D> {
  readonly isRequired = false;
  readonly isDirty = false;
  readonly error = undefined;
  readonly serialized = $derived(this.data);
  rollback() {}
}

export class StringField extends ValueField<string, StringFieldDefinition> {}
export class NumberField extends ValueField<number, NumberFieldDefinition> {}

type BaseFieldDefinitionOptions = {
  label?: string;
  description?: string;
};

export type FieldDefinitionOptions = {
  context: FieldsContext;
  key: string;
} & BaseFieldDefinitionOptions;

export abstract class FieldDefinition {
  private readonly opts: FieldDefinitionOptions;

  readonly context = $derived.by(() => this.opts.context);
  readonly key = $derived.by(() => this.opts.key);
  readonly label = $derived.by(() => this.opts.label ?? sentenceCase(this.key));
  readonly description = $derived.by(() => this.opts.description);

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

export type InferSerializedFromFieldsRecord<R extends Data> = {
  [K in keyof R]: InferSerializedFromField<R[K]>;
};

export type InferSerializedFromField<T> = T extends Field ? T['serialized'] : T;

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
  readonly context = $derived.by(() => this.opts.factory.context);
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
    return record as InferFieldsFromDefinitionRecord<typeof definitions>;
  });

  readonly serialized = $derived.by(() => {
    const record = this.record;
    const serialized: Record<string, unknown> = {};
    for (const key in record) {
      const field = record[key];
      if (field instanceof Field) {
        serialized[key] = field.serialized;
      } else {
        serialized[key] = field;
      }
    }
    return serialized as InferSerializedFromFieldsRecord<typeof record>;
  });
}

export type FactoryOptions<D extends Data = Data, R extends Data = Data> = {
  context: FieldsContext;
  cb: (factory: Factory<D>) => R;
};

export class Factory<D extends Data = Data, R extends Data = Data> {
  private readonly opts: FactoryOptions<D, R>;
  readonly context = $derived.by(() => this.opts.context);

  constructor(opts: OptionsInput<FactoryOptions<D, R>>) {
    this.opts = options(opts);
  }

  readonly record = $derived.by(() => this.opts.cb(this));

  private get base() {
    return {
      context: getter(() => this.context),
    };
  }

  readonly string = <K extends StringKey<D>>(key: K, opts?: OptionsInput<BaseFieldDefinitionOptions>) => {
    return new StringFieldDefinition({ key, ...this.base, ...opts });
  };

  readonly number = <K extends NumberKey<D>>(key: K, opts?: OptionsInput<BaseFieldDefinitionOptions>) => {
    return new NumberFieldDefinition({ key, ...this.base, ...opts });
  };
}

export type FieldsDefinitionOptions<D extends Data = Data> = {
  data: D;
  context?: FieldsContext;
};

export class FieldsDefinition<D extends Data = Data> {
  private readonly opts: FieldsDefinitionOptions<D>;

  readonly data = $derived.by(() => this.opts.data);
  readonly context = $derived.by(() => this.opts.context ?? new FieldsContext());

  constructor(opts: OptionsInput<FieldsDefinitionOptions<D>>) {
    this.opts = options(opts);
  }

  factory<R extends Data>(cb: (factory: Factory<D>) => R) {
    return new Factory({
      cb,
      context: getter(() => this.context),
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
