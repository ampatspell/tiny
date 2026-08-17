import { extract, type MaybeGetter } from 'runed';
import { Property, type UsePropertyOptions } from './property.svelte.ts';

export class DataProperty<D extends Record<string, unknown>, K extends keyof D & string> extends Property<D[K]> {
  readonly key: K;

  constructor(data: MaybeGetter<D>, key: K, opts?: Omit<UsePropertyOptions<D[K]>, 'value'>) {
    super({
      ...opts,
      value: () => extract(data)[key],
    });
    this.key = key;
  }

  pack(data: Partial<D>) {
    data[this.key] = this.value;
    return data;
  }
}

export const useDataProperty = <D extends Record<string, unknown>, K extends keyof D & string>(
  data: MaybeGetter<D>,
  key: K,
  opts?: Omit<UsePropertyOptions<D[K]>, 'value'>,
) => {
  return new DataProperty<D, K>(data, key, opts);
};

export class DataProperties<D extends Record<string, unknown> = Record<string, unknown>> {
  private readonly __data: MaybeGetter<D>;
  private _properties: DataProperty<D, string>[] = [];

  constructor(data: MaybeGetter<D>) {
    this.__data = data;
  }

  readonly _data = $derived.by(() => extract(this.__data));

  property = <K extends keyof D & string>(key: K, opts?: Omit<UsePropertyOptions<D[K]>, 'value'>) => {
    const prop = useDataProperty<D, K>(this.__data, key, opts);
    this._properties.push(prop as unknown as DataProperty<D, string>);
    return prop;
  };

  readonly data = $derived.by(() => {
    const data: Record<string, unknown> = {};
    this._properties.forEach((prop) => {
      data[prop.key] = prop.value;
    });
    return data as D;
  });

  readonly dirty = $derived.by(() => {
    const data: Record<string, unknown> = {};
    this._properties.forEach((prop) => {
      if (prop.isDirty) {
        data[prop.key] = prop.value;
      }
    });
    if (Object.keys(data).length === 0) {
      return undefined;
    }
    return data as Partial<D>;
  });
}

export const useDataProperties = <D extends Record<string, unknown>>(data: MaybeGetter<D>) =>
  new DataProperties<D>(data);
