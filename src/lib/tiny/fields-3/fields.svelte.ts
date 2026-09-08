import { getter, options, type OptionsInput } from '../utils/options.svelte.ts';
import type { Factory } from './factory.svelte.ts';
import { FieldDefinition } from './field-definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type {
  Data,
  InferFieldsDefinitionRecordFromFactory,
  InferFieldsFromDefinitionRecord,
  InferSerializedFromFieldsRecord,
} from './types.svelte.ts';

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
