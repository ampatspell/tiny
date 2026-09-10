import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any } from '#lib/tiny/utils/utils.js';
import type { Factory } from './factory.svelte.ts';
import { FieldDefinition } from './field-definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type {
  Data,
  InferFieldsDefinitionRecordFromFactory,
  InferFieldsRecordFromDefinitionRecord,
  InferFieldsRecordFromFactory,
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
    const { definition } = this;
    const data = getter(() => this.data);
    const record: Record<string, unknown> = {};
    for (const key in definition) {
      const value = definition[key];
      if (value instanceof FieldDefinition) {
        record[key] = value.field({ data });
      } else {
        record[key] = value;
      }
    }
    return record as InferFieldsRecordFromDefinitionRecord<typeof definition>;
  });

  readonly serialized = new Serialized(this);

  private readonly all = $derived.by(() => {
    const all: Field[] = [];
    const fields = this.record;
    for (const key in fields) {
      const field = fields[key];
      if (field instanceof Field) {
        all.push(...field['fields']);
      }
    }
    return all;
  });

  readonly isDirty = $derived(!!this.all.find((field) => field.isDirty));
  readonly isValid = $derived(!this.all.find((field) => !field.isValid));
  readonly isTouched = $derived(this.context.isTouched);

  readonly touch = () => {
    this.context.touch();
    return this.isValid;
  };

  readonly rollback = () => {
    this.all.forEach((field) => field.rollback());
    this.context.isTouched = false;
  };

  asEditable<O>(
    opts: OptionsInput<O>,
    meta?: {
      name: string;
      serialized?: (keyof O | 'isDirty' | 'isValid' | 'isTouched' | 'rollback')[];
    },
  ) {
    type R = O & {
      fields: InferFieldsRecordFromFactory<F>;
      isDirty: boolean;
      isValid: boolean;
      isTouched: boolean;
      rollback: () => void;
    };
    return options<Any>(
      {
        fields: getter(() => this.record),
        isDirty: getter(() => this.isDirty),
        isValid: getter(() => this.isValid),
        isTouched: getter(() => this.isTouched),
        rollback: () => this.rollback(),
        ...opts,
      },
      meta,
    ) as R;
  }
}
