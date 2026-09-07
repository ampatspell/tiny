import { getter, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { clone } from '../utils/clone.ts';
import { equals } from '../utils/equals.ts';
import { FieldDefinition, type FieldDefinitionBuildOptions, type FieldDefinitionOptions } from './definition.svelte.ts';
import { Field, type FieldOptions } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export type FieldUpdatePair<T> = { before: T; after: T };

export type Validator<T> = {
  validate: (value: T) => string | boolean | undefined;
  isRequired: boolean;
};

export type Optionals<T> = {
  willUpdate?: (pair: FieldUpdatePair<T>) => void;
  didUpdate?: (pair: FieldUpdatePair<T>) => void;
  validator?: Validator<T>;
};

export type ValueFieldOptions<D extends Data, T> = FieldOptions<D, T> & Optionals<T>;

export abstract class ValueField<
  D extends Data = Data,
  T = unknown,
  S = unknown,
  O extends ValueFieldOptions<D, T> = ValueFieldOptions<D, T>,
> extends Field<D, T, S, O> {
  private _value = $derived(clone(this.external));
  readonly value = $derived(this._value);
  readonly validator = $derived(this.opts.validator);
  readonly isDirty = $derived(!equals(this.external, this.value));
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
      this.opts.willUpdate?.(pair);
      this._value = after;
      this.opts.didUpdate?.(pair);
    }
  };

  readonly rollback = () => {
    this.update(this.external);
  };
}

export type ValueFieldDefinitionOptions<T> = FieldDefinitionOptions & Optionals<T>;

export abstract class ValueFieldDefinition<
  D extends Data,
  T,
  F extends ValueField<D, T>,
  O extends ValueFieldDefinitionOptions<T> = ValueFieldDefinitionOptions<T>,
> extends FieldDefinition<D, T, F, O> {
  protected abstract valueField(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<T>>): F;

  field(opts: OptionsInput<FieldDefinitionBuildOptions<D>>): F {
    return this.valueField({
      ...opts,
      willUpdate: getter(() => this.opts.willUpdate),
      didUpdate: getter(() => this.opts.didUpdate),
      validator: getter(() => this.opts.validator),
    });
  }
}
