import { useProperty, type UsePropertyOptions } from './property.svelte.ts';
import { createPropertiesContext, type PropertiesContext } from './context.svelte.ts';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { addObject } from '../utils/array.ts';
import type { Any } from '../utils/utils.ts';

type DataProperties<D extends Data> = Record<string, DataProperty<D, string>>;

type UseDataPropertyOptions<D extends Data, K extends keyof D & string> = {
  data: D;
  key: K;
  prop: Omit<UsePropertyOptions<D[K]>, 'value'>;
};

const createDataProperty = <D extends Data, K extends keyof D & string>(
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
  typeof createDataProperty<D, K>
>;

export type Data = Record<string, unknown>;

export type WithDataOptions<D extends Data> = {
  data: D;
  context?: PropertiesContext;
};

export const withDataProperties = <D extends Data = Data>(_opts: OptionsInput<WithDataOptions<D>>) => {
  const opts = options(_opts);
  const context = opts.context ?? createPropertiesContext();
  const properties = $state<DataProperty<D, Any>[]>([]);

  const property = <K extends keyof D & string>(
    key: K,
    propertyOptions?: Omit<UsePropertyOptions<D[K]>, 'value' | 'context'>,
  ) => {
    const prop = createDataProperty<D, K>({
      data: getter(() => opts.data),
      key,
      prop: { ...propertyOptions, context },
    });
    addObject(properties, prop);
    return prop;
  };

  const factory = () => {
    return { property };
  };

  const createState = () => {
    const isDirty = getter(() => context.isDirty);
    const rollback = () => context.rollback();

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

    return options(
      {
        isDirty,
        isValid: getter(() => context.isValid),
        isTouched: getter(() => context.isTouched),
        errors: getter(() => context.errors),
        touched: getter(() => context.touched),
        touch: () => context.touch(),
        data: getter(() => data),
        dirty: getter(() => dirty),
        rollback,
        opts: {
          isDirty,
          rollback,
        },
      },
      {
        name: 'DataPropertiesState',
      },
    );
  };

  const create = () => {
    return {
      factory: factory(),
      state: createState(),
    };
  };

  const define = <R extends DataProperties<D>>(
    cb: (arg: ReturnType<typeof factory>) => R,
  ): [R, ReturnType<typeof createState>] => {
    const { factory, state } = create();
    const object = cb(factory);
    return [object, state];
  };

  return {
    create,
    define,
  };
};

export type DataPropertiesState = ReturnType<ReturnType<typeof withDataProperties>['define']>[1];
