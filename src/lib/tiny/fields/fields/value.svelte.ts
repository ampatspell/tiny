import { equals } from '#lib/tiny/utils/equals.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any } from '#lib/tiny/utils/utils.js';
import { FieldDefinition, type FieldDefinitionOptions } from '../models/field-definition.svelte.ts';
import { Field } from '../models/field.svelte.ts';
import type { Validator } from '../models/validator.svelte.ts';

export type SerializedValueFieldOptions<V> = { isDirty: boolean; value: V };

export class SerializedValueField<V = unknown> {
  private readonly opts: SerializedValueFieldOptions<V>;
  constructor(opts: OptionsInput<SerializedValueFieldOptions<V>>) {
    this.opts = options(opts);
  }

  readonly all = $derived.by(() => {
    return this.opts.value;
  });

  readonly dirty = $derived.by(() => {
    const { opts } = this;
    if (opts.isDirty) {
      return opts.value;
    }
  });
}

export type FieldUpdatePair<T, F> = { field: F; before: T; after: T };

export abstract class ValueField<
  T = unknown,
  S = unknown,
  D extends ValueFieldDefinition<T, Any, Any> = ValueFieldDefinition<T>,
> extends Field<T, D> {
  private _value = $derived(this.data);
  readonly value = $derived(this._value);
  readonly isDirty = $derived(!equals(this.data, this.value));
  readonly validator = $derived(this.definition.validator);
  readonly isRequired = $derived.by(() => this.validator?.isRequired ?? false);
  readonly serialized = new SerializedValueField({
    isDirty: getter(() => this.isDirty),
    value: getter(() => this._serialized),
  });

  readonly error = $derived.by(() => {
    const fn = this.validator?.validate;
    if (fn) {
      const res = fn(this.value);
      if (typeof res === 'string' && res === '') {
        throw new Error(`Don't use blank string as an validation result. It is ambiguous`);
      }
      if (typeof res === 'boolean') {
        if (!res) {
          return 'Not valid';
        } else {
          return undefined;
        }
      }
      return res;
    }
    return undefined;
  });

  readonly update = (after: T) => {
    const before = this.value;
    if (!equals(before, after)) {
      const pair = { field: this, before, after };
      this.definition.willUpdate(pair);
      this._value = after;
      this.definition.didUpdate(pair);
    }
  };

  readonly rollback = () => {
    this.update(this.data);
  };

  protected abstract readonly _serialized: S;
}

export type BaseValueFieldDefinitionOptions<T, F> = {
  willUpdate?: (pair: FieldUpdatePair<T, F>) => void;
  didUpdate?: (pair: FieldUpdatePair<T, F>) => void;
  validator?: Validator<T>;
};

export type ValueFieldDefinitionOptions<T, F = ValueField<T, Any, Any>> = FieldDefinitionOptions &
  BaseValueFieldDefinitionOptions<T, F>;

export abstract class ValueFieldDefinition<
  T = unknown,
  F = ValueField<T, Any, Any>,
  O extends ValueFieldDefinitionOptions<T, F> = ValueFieldDefinitionOptions<T, F>,
> extends FieldDefinition<O> {
  readonly validator = $derived(this.opts.validator);

  willUpdate(pair: FieldUpdatePair<T, F>) {
    this.opts.willUpdate?.(pair);
  }

  didUpdate(pair: FieldUpdatePair<T, F>) {
    this.opts.didUpdate?.(pair);
  }
}
