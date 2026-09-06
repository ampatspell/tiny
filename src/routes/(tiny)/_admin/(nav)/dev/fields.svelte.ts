import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { FieldsContext } from './context.svelte.ts';
import type { FieldDefinitions, InferFieldsFromDefinitions } from './definitions.svelte.ts';
import type { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export type FieldsOptions<D, FD> = {
  context: FieldsContext;
  data: D;
  definitions: FD;
};

export class Fields<D extends Data, FD extends FieldDefinitions<D>, FR = InferFieldsFromDefinitions<FD['record']>> {
  private readonly opts: FieldsOptions<D, FD>;

  readonly data = $derived.by(() => this.opts.data);
  readonly definitions = $derived.by(() => this.opts.definitions);

  readonly record: FR = $derived.by(() => {
    const record: Record<string, unknown> = {};
    const definitions = this.definitions.record;
    for (const key in definitions) {
      const definition = definitions[key];
      const data = getter(() => this.data);
      record[key] = definition.field({
        definition,
        data,
      });
    }
    return record as FR;
  });

  readonly all = $derived.by(() => {
    const fields: Field[] = [];
    const record = this.record;
    for (const key in record) {
      const field = record[key] as Field;
      fields.push(...field.fields);
    }
    return fields;
  });

  constructor(opts: OptionsInput<FieldsOptions<D, FD>>) {
    this.opts = options(opts);
  }
}
