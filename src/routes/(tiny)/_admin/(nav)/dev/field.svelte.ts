import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any } from '#lib/tiny/utils/utils.js';
import type { FieldDefinition } from './definition.svelte.ts';
import type { Data } from './index.svelte.ts';

class TouchedField {
  private isTouched = $derived.by(() => this.field.isTouched);

  constructor(private readonly field: Field) {}

  readonly error = $derived.by(() => {
    if (this.isTouched) {
      return this.field.error;
    }
  });
}

export type FieldOptions<D extends Data, T> = {
  data: D;
  definition: FieldDefinition<D, T, Any>;
};

export abstract class Field<D extends Data = Data, T = unknown, O extends FieldOptions<D, T> = FieldOptions<D, T>> {
  protected readonly opts: O;

  readonly data = $derived.by(() => this.opts.data);
  readonly external = $derived.by(() => this.data[this.key] as T);

  readonly definition = $derived.by(() => this.opts.definition);
  readonly context = $derived.by(() => this.definition.context);
  readonly isTouched = $derived(this.context.isTouched);

  readonly key = $derived.by(() => this.definition.key);
  readonly label = $derived.by(() => this.definition.label);
  readonly description = $derived.by(() => this.definition.description);
  readonly isValid = $derived.by(() => !this.error);
  readonly touched = new TouchedField(this);

  constructor(opts: OptionsInput<O>) {
    this.opts = options(opts);
  }

  abstract readonly isRequired: boolean;
  abstract readonly isDirty: boolean;
  abstract readonly error: string | undefined;
  abstract rollback(): void;

  readonly fields: Field[] = $derived([this]);
}
