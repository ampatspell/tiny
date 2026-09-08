import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Factory } from './factory.svelte.ts';
import { FieldDefinition } from './field-definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type {
  Data,
  InferFieldsDefinitionRecordFromFactory,
  InferFieldsFromDefinitionRecord,
  InferSerializedAllFromFieldsRecord,
  InferSerializedDirtyFromFieldsRecord,
} from './types.svelte.ts';

export class Serialized<
  D extends Data = Data,
  F extends Factory<D, InferFieldsDefinitionRecordFromFactory<F>> = Factory<D>,
> {
  private readonly fields: Fields<D, F>;
  private readonly record = $derived.by(() => this.fields.record);

  constructor(fields: Fields<D, F>) {
    this.fields = fields;
  }

  private withFields(cb: (arg: unknown) => unknown) {
    const record = this.record;
    const serialized: Record<string, unknown> = {};
    for (const key in record) {
      const field = record[key];
      const result = cb(field);
      if (result !== undefined) {
        serialized[key] = result;
      }
    }
    return serialized;
  }

  readonly all = $derived.by(() => {
    return this.withFields((arg) => {
      if (arg instanceof Field) {
        return arg.serialized.all;
      } else {
        return arg;
      }
    }) as InferSerializedAllFromFieldsRecord<typeof this.record>;
  });

  readonly dirty = $derived.by(() => {
    const serialized = this.withFields((arg) => {
      if (arg instanceof Field) {
        return arg.serialized.dirty;
      } else {
        return arg;
      }
    }) as Partial<InferSerializedDirtyFromFieldsRecord<typeof this.record>>;
    if (Object.keys(serialized).length) {
      return serialized;
    }
  });
}

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

  readonly serialized = new Serialized(this);

  private readonly all = $derived.by(() => {
    const all: Field[] = [];
    const fields = this.record;
    for (const key in fields) {
      const field = fields[key] as Field;
      all.push(...field['fields']);
    }
    return all;
  });

  readonly isDirty = $derived(!!this.all.find((field) => field.isDirty));
  readonly isValid = $derived(!this.all.find((field) => !field.isValid));
  readonly isTouched = $derived(this.context.isTouched);

  readonly state = $derived.by(() => {
    return {
      isDirty: getter(() => this.isDirty),
      rollback: () => this.rollback(),
    };
  });

  readonly touch = () => {
    this.context.touch();
    return this.isValid;
  };

  readonly rollback = () => {
    this.all.forEach((field) => field.rollback());
    this.context.isTouched = false;
  };
}
