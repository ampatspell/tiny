import type { Component } from 'svelte';
import { clone } from '../utils/clone.ts';
import { options, type OptionsInput } from '../utils/options.svelte.ts';
import type { Any } from '../utils/utils.ts';
import type { FieldDefinition } from './field-definition.svelte.ts';
import type { Data } from './types.svelte.ts';

class TouchedField {
  private readonly isTouched = $derived.by(() => this.field.isTouched);

  constructor(private readonly field: Field) {}

  readonly error = $derived.by(() => {
    if (this.isTouched) {
      return this.field.error;
    }
  });
}

export type FieldOptions<FD extends FieldDefinition> = {
  definition: FD;
  data: Data;
};

export abstract class Field<
  T = unknown,
  FD extends FieldDefinition = FieldDefinition,
  O extends FieldOptions<FD> = FieldOptions<FD>,
> {
  private readonly opts: O;
  private readonly parent = $derived.by(() => this.opts.data);
  readonly data = $derived.by(() => clone(this.parent[this.key] as T));

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
  abstract readonly serialized: { all: unknown; dirty: unknown };
  abstract rollback(): void;

  protected readonly fields: Field[] = $derived([this]);
  protected abstract readonly editor: Component<{ field: Any }> | undefined;
}
