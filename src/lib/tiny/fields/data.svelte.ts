import type { InputType } from '$lib/tiny/input.js';
import type { UniversalFile } from '$lib/tiny/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { run } from '$lib/tiny/utils/utils.js';
import { useDataProperties, type UseDataPropertiesOptions } from '../properties/data.svelte.ts';
import type { Property, UsePropertyOptions } from '../properties/property.svelte.ts';
import { fileField } from './file.svelte.ts';
import { colorField, stringField } from './input.svelte.ts';
import { numberField } from './number.svelte.ts';

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

  const field = run(() => {
    type PropertyOpts<K extends keyof D> = Omit<UsePropertyOptions<D[K]>, 'value'>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const as = <T>(property: Property<any>): Property<T> => {
      return property as Property<T>;
    };

    const string = <K extends StringKey<D>>(key: K, opts?: PropertyOpts<K> & { type?: InputType }) => {
      const property = as<string>(properties.property(key, opts));
      return stringField({ property, type: opts?.type });
    };

    const number = <K extends NumberKey<D>>(key: K, opts?: PropertyOpts<K>) => {
      const property = as<number>(properties.property(key, opts));
      return numberField({ property });
    };

    const color = <K extends StringKey<D>>(key: K, opts?: PropertyOpts<K>) => {
      const property = as<string>(properties.property(key, opts));
      return colorField({ property });
    };

    const file = <K extends FileKey<D>>(key: K, opts: PropertyOpts<K> & { accept: string[] }) => {
      const property = as<UniversalFile | undefined>(properties.property<K>(key, opts));
      return fileField({ property, accept: opts.accept });
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
