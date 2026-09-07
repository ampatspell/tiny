import { options, type OptionsInput } from '../utils/options.svelte.ts';
import type { FieldDefinition } from './field-definition.svelte.ts';
import type { Data } from './types.svelte.ts';

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
