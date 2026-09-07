import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { FieldsContext } from './context.svelte.ts';
import type {
  FieldDefinitions,
  InferFieldsFromDefinitions,
  InferFieldsRecordFromDefinition,
} from './definitions.svelte.ts';
import type { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export type Serialized<D extends Data, FD extends FieldDefinitions<D>> = {
  [K in keyof InferFieldsRecordFromDefinition<D, FD>]: InferFieldsRecordFromDefinition<D, FD>[K]['serialized'];
};

class SerializedFields<D extends Data, FD extends FieldDefinitions<D>> {
  constructor(private readonly fields: Fields<D, FD>) {}

  private filtered(filter: (field: Field) => boolean) {
    const output = {} as Partial<Serialized<D, FD>>;
    const record = this.fields.fields;
    for (const key in record) {
      const field = record[key] as Field;
      if (filter(field)) {
        output[key] = field.serialized;
      }
    }
    return output;
  }

  readonly all = $derived.by(() => {
    return this.filtered(() => true) as Serialized<D, FD>;
  });

  readonly dirty = $derived.by(() => {
    const output = this.filtered((field) => field.isDirty) as Serialized<D, FD>;
    if (Object.keys(output).length) {
      return output;
    }
  });
}

export type FieldsOptions<D, FD> = {
  context: FieldsContext;
  data: D;
  definitions: FD;
};

export class Fields<D extends Data, FD extends FieldDefinitions<D>> {
  private readonly opts: FieldsOptions<D, FD>;

  readonly context = $derived.by(() => this.opts.context);
  readonly data = $derived.by(() => this.opts.data);
  readonly definitions = $derived.by(() => this.opts.definitions);
  readonly serialized = $derived(new SerializedFields<D, FD>(this));

  readonly fields = $derived.by(() => {
    const record: Record<string, unknown> = {};
    const definitions = this.definitions.record;
    const data = getter(() => this.data);
    for (const key in definitions) {
      const definition = definitions[key];
      if (definition) {
        record[key] = definition.field({
          definition,
          data,
        });
      }
    }
    return record as InferFieldsFromDefinitions<FD['record']>;
  });

  readonly all = $derived.by(() => {
    const all: Field[] = [];
    const fields = this.fields;
    for (const key in fields) {
      const field = fields[key] as Field;
      all.push(...field.fields);
    }
    return all;
  });

  constructor(opts: OptionsInput<FieldsOptions<D, FD>>) {
    this.opts = options(opts);
  }

  readonly isDirty = $derived(!!this.all.find((field) => field.isDirty));
  readonly isValid = $derived(!this.all.find((field) => !field.isValid));
  readonly isTouched = $derived(this.context.isTouched);

  readonly touch = () => {
    this.context.touch();
    return this.isValid;
  };

  readonly rollback = () => {
    this.all.forEach((field) => field.rollback());
  };
}
