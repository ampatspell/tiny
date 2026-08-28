import { useProperty, type UsePropertyOptions } from './property.svelte.ts';
import { usePropertiesContext } from './context.svelte.ts';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { hasKeys, omit, pick } from '$lib/tiny/utils/object.js';
import { addObject } from '$lib/tiny/utils/array.js';

export type UseDataPropertyOptions<D extends Record<string, unknown>, K extends keyof D & string> = {
  data: D;
  key: K;
  prop?: Omit<UsePropertyOptions<D[K]>, 'value'>;
};

export const useDataProperty = <D extends Record<string, unknown>, K extends keyof D & string>(
  _opts: OptionsInput<UseDataPropertyOptions<D, K>>,
) => {
  const opts = options(_opts);
  const data = $derived(opts.data);
  const key = $derived(opts.key);

  const property = useProperty<D[K]>({
    ...opts.prop,
    value: getter(() => data[key]),
  });

  const value = $derived(property.value);
  const update = property.update;
  const meta = $derived(property.meta);
  const error = $derived(property.error);
  const isDirty = $derived(property.isDirty);
  const isTouched = $derived(property.isTouched);
  const isValid = $derived(property.isValid);
  const rollback = property.rollback;
  const touched = $derived(property.touched);

  const pack = (data: Partial<D>) => {
    data[key] = value;
    return data;
  };

  return options(
    {
      key: getter(() => key),
      data: getter(() => data),
      value: getter(() => value),
      update,
      rollback,
      isDirty: getter(() => isDirty),
      isValid: getter(() => isValid),
      error: getter(() => error),
      isTouched: getter(() => isTouched),
      touched: getter(() => touched),
      meta: getter(() => meta),
      pack,
    },
    {
      name: 'DataProperty',
      serialized: ['key', 'value', 'isDirty', 'isValid'],
    },
  );
};

export type DataProperty<D extends Record<string, unknown>, K extends keyof D & string> = ReturnType<
  typeof useDataProperty<D, K>
>;

export type UseDataPropertiesOptions<D extends Record<string, unknown>> = {
  data: D;
};

export const useDataProperties = <D extends Record<string, unknown>>(
  _opts: OptionsInput<UseDataPropertiesOptions<D>>,
) => {
  const opts = options(_opts);
  const context = usePropertiesContext();
  const properties = $state<DataProperty<D, string>[]>([]);
  const property = <K extends keyof D & string>(key: K, propertyOptions?: Omit<UsePropertyOptions<D[K]>, 'value'>) => {
    const prop = useDataProperty<D, K>({
      data: getter(() => opts.data),
      key,
      prop: propertyOptions,
    });
    addObject(properties, prop as unknown as DataProperty<D, string>);
    return prop;
  };

  const data = $derived.by(() => {
    const data: Record<string, unknown> = {};
    properties.forEach((prop) => {
      data[prop.key] = prop.value;
    });
    return data as D;
  });

  const dirty = $derived.by(() => {
    const data: Record<string, unknown> = {};
    properties.forEach((prop) => {
      if (prop.isDirty) {
        data[prop.key] = prop.value;
      }
    });
    if (Object.keys(data).length === 0) {
      return undefined;
    }
    return data as Partial<D>;
  });

  const touch = () => context.touch();
  const rollback = () => context.rollback();
  const touched = $derived(context.touched);
  const errors = $derived(context.errors);
  const isTouched = $derived(context.isTouched);
  const isValid = $derived(context.isValid);
  const isDirty = $derived(context.isDirty);

  const withKeys = (...keys: (keyof D & string)[]) => {
    const dataOmit = $derived.by(() => omit(data, keys));
    const dataPick = $derived.by(() => pick(data, keys));
    const dirtyOmit = $derived.by(() => {
      if (dirty) {
        const object = omit(dirty, keys);
        if (hasKeys(object)) {
          return object;
        }
      }
    });
    const dirtyPick = $derived.by(() => {
      if (dirty) {
        const object = pick(dirty, keys);
        if (hasKeys(object)) {
          return object;
        }
      }
    });

    return {
      data: options({
        omit: getter(() => dataOmit),
        pick: getter(() => dataPick),
      }),
      dirty: options({
        omit: getter(() => dirtyOmit),
        pick: getter(() => dirtyPick),
      }),
    };
  };

  return options(
    {
      context,
      property,
      data: getter(() => data),
      dirty: getter(() => dirty),
      with: withKeys,
      touch,
      rollback,
      touched: getter(() => touched),
      errors: getter(() => errors),
      isTouched: getter(() => isTouched),
      isValid: getter(() => isValid),
      isDirty: getter(() => isDirty),
    },
    {
      name: 'DataProperties',
      serialized: ['isDirty', 'isValid'],
    },
  );
};

export type DataProperties<D extends Record<string, unknown>> = ReturnType<typeof useDataProperties<D>>;
