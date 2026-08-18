import { extract, type MaybeGetter } from 'runed';
import { Property, type UsePropertyOptions } from './property.svelte.ts';
import { capitalize } from '$lib/utils/string.js';
import { usePropertiesContext } from './context.svelte.ts';
import { getter, options, type OptionsInput } from '$lib/utils/options.js';

export class DataProperty<D extends Record<string, unknown>, K extends keyof D & string> extends Property<D[K]> {
  readonly key: K;

  constructor(data: MaybeGetter<D>, key: K, opts?: Omit<UsePropertyOptions<D[K]>, 'value'>) {
    super({
      ...opts,
      value: () => extract(data)[key],
      meta: Object.assign({ label: capitalize(key) }, opts?.meta),
    });
    this.key = key;
  }

  pack(data: Partial<D>) {
    data[this.key] = this.value;
    return data;
  }
}

export type UseDataPropertyOptions<D extends Record<string, unknown>, K extends keyof D & string> = {
  data: D;
  key: K;
  opts?: Omit<UsePropertyOptions<D[K]>, 'value'>;
};

export const useDataProperty = <D extends Record<string, unknown>, K extends keyof D & string>(
  _opts: UseDataPropertyOptions<D, K>,
) => {
  return {};
};

export type UseDataProperty<D extends Record<string, unknown>, K extends keyof D & string> = ReturnType<
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
  const properties: DataProperty<D, string>[] = [];

  const property = <K extends keyof D & string>(key: K, propertyOptions?: Omit<UsePropertyOptions<D[K]>, 'value'>) => {
    const prop = useDataProperty<D, K>(opts.data, key, propertyOptions);
    properties.push(prop as unknown as DataProperty<D, string>);
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

  return options({
    context,
    property,
    data: getter(() => data),
    dirty: getter(() => dirty),
    touch,
    rollback,
    touched: getter(() => touched),
    errors: getter(() => errors),
    isTouched: getter(() => isTouched),
    isValid: getter(() => isValid),
    isDirty: getter(() => isDirty),
  });
};

export type UseDataProperties<D extends Record<string, unknown>> = ReturnType<typeof useDataProperties<D>>;
