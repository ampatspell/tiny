import { equals } from '../utils/equals.ts';
import { FieldDefinition, type FieldDefinitionOptions } from './field-definition.svelte.ts';
import { Field } from './field.svelte.ts';

export type FieldUpdatePair<T> = { before: T; after: T };

export type Validator<T> = {
  validate: (value: T) => string | boolean | undefined;
  isRequired: boolean;
};

export abstract class ValueField<
  T = unknown,
  D extends ValueFieldDefinition<T> = ValueFieldDefinition<T>,
> extends Field<T, D> {
  private _value = $derived(this.data);
  readonly value = $derived(this._value);
  readonly isDirty = $derived(!equals(this.data, this.value));
  readonly validator = $derived(this.definition.validator);
  readonly isRequired = $derived.by(() => this.validator?.isRequired ?? false);

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
      const pair = { before, after };
      this.definition.willUpdate(pair);
      this._value = after;
      this.definition.didUpdate(pair);
    }
  };

  readonly rollback = () => {
    this.update(this.data);
  };

  readonly serialized = $derived(this.data);
}

export type BaseValueFieldDefinitionOptions<T> = {
  willUpdate?: (pair: FieldUpdatePair<T>) => void;
  didUpdate?: (pair: FieldUpdatePair<T>) => void;
  validator?: Validator<T>;
};

export type ValueFieldDefinitionOptions<T> = FieldDefinitionOptions & BaseValueFieldDefinitionOptions<T>;

export abstract class ValueFieldDefinition<
  T = unknown,
  O extends ValueFieldDefinitionOptions<T> = ValueFieldDefinitionOptions<T>,
> extends FieldDefinition<O> {
  readonly validator = $derived(this.opts.validator);

  willUpdate(pair: FieldUpdatePair<T>) {
    this.opts.willUpdate?.(pair);
  }

  didUpdate(pair: FieldUpdatePair<T>) {
    this.opts.didUpdate?.(pair);
  }
}
