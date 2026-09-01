import { sentenceCase } from '#lib/tiny/utils/string.js';
import type { UniversalFile } from '#lib/tiny/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { run, type Any } from '#lib/tiny/utils/utils.js';
import { useDataProperties, type UseDataPropertiesOptions } from '../properties/data.svelte.ts';
import type { Property, UsePropertyOptions } from '../properties/property.svelte.ts';
import { fileField } from './file/field.svelte.ts';
import { colorField, stringField } from './input/field.svelte.ts';
import { numberField } from './input/number.svelte.ts';
import type { BaseFieldOptions, Field } from './utils.svelte.ts';
import type { InputType } from '../input.svelte';

export type StringKey<T> = {
  [K in keyof T]: T[K] extends string ? K & string : never;
}[keyof T];

export type NumberKey<T> = {
  [K in keyof T]: T[K] extends number ? K & string : never;
}[keyof T];

export type FileKey<T> = {
  [K in keyof T]: T[K] extends UniversalFile | undefined ? K & string : never;
}[keyof T];

export const useDataFields = <D extends Record<string, unknown>>(_opts: OptionsInput<UseDataPropertiesOptions<D>>) => {
  const properties = useDataProperties<D>(_opts);
  const fields: { key: keyof D; field: Field }[] = [];

  const field = run(() => {
    type PropertyOptions<K extends keyof D> = Omit<UsePropertyOptions<D[K]>, 'value'>;
    type FieldOptions<K extends keyof D> = PropertyOptions<K> & BaseFieldOptions;

    const as = <T>(property: Property<Any>): Property<T> => {
      return property as Property<T>;
    };

    const split = <K extends keyof D>(key: string, opts?: FieldOptions<K>) => {
      const { willUpdate, didUpdate, meta, onRollback, passive, validator } = opts ?? {};
      return {
        property: {
          willUpdate,
          didUpdate,
          onRollback,
          passive,
          validator,
        },
        field: {
          meta: { label: sentenceCase(key), ...meta },
        },
      };
    };

    const add = <F extends Field>(key: keyof D, field: F): F => {
      fields.push({ key, field });
      return field;
    };

    const string = <K extends StringKey<D>>(key: K, _opts?: FieldOptions<K> & { type?: InputType }) => {
      const opts = split(key, _opts);
      const property = as<string>(properties.property(key, opts.property));
      return add(key, stringField({ property, ...opts.field, type: _opts?.type }));
    };

    const number = <K extends NumberKey<D>>(key: K, _opts?: FieldOptions<K>) => {
      const opts = split(key, _opts);
      const property = as<number>(properties.property(key, opts.property));
      return add(key, numberField({ property, ...opts.field }));
    };

    const color = <K extends StringKey<D>>(key: K, _opts?: FieldOptions<K>) => {
      const opts = split(key, _opts);
      const property = as<string>(properties.property(key, opts.property));
      return add(key, colorField({ property, ...opts.field }));
    };

    const file = <K extends FileKey<D>>(key: K, _opts: FieldOptions<K> & { accept: string[] }) => {
      const opts = split(key, _opts);
      const property = as<UniversalFile | undefined>(properties.property<K>(key, opts.property));
      return add(key, fileField({ property, ...opts.field, accept: _opts.accept }));
    };

    return {
      string,
      number,
      color,
      file,
    };
  });

  const context = $derived(properties.context);
  const data = $derived(properties.data);
  const dirty = $derived(properties.dirty);
  const errors = $derived(properties.errors);
  const isDirty = $derived(properties.isDirty);
  const isTouched = $derived(properties.isTouched);
  const isValid = $derived(properties.isValid);
  const rollback = $derived(properties.rollback);
  const touch = $derived(properties.touch);
  const touched = $derived(properties.touched);
  const withKeys = $derived(properties.with);

  return options(
    {
      properties,
      field: getter(() => field),
      context: getter(() => context),
      data: getter(() => data),
      dirty: getter(() => dirty),
      errors: getter(() => errors),
      isDirty: getter(() => isDirty),
      isTouched: getter(() => isTouched),
      isValid: getter(() => isValid),
      rollback: getter(() => rollback),
      touch: getter(() => touch),
      touched: getter(() => touched),
      with: getter(() => withKeys),
    },
    { name: 'DataFields' },
  );
};
