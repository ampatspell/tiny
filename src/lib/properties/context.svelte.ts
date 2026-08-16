import { getContext, hasContext, setContext } from 'svelte';
import type { Property, PropertyUpdatePair } from './property.svelte.ts';
import { addObject, isTruthy, removeObject } from '$lib/utils/array.js';

export type UpdateParams<T> = [property: Property<T>, pair: PropertyUpdatePair<T>];

export type Parent = {
  willUpdate: (...args: UpdateParams<unknown>) => void;
  didUpdate: (...args: UpdateParams<unknown>) => void;
};

export class Properties {
  private readonly _all: () => Property[];

  constructor(all: () => Property[]) {
    this._all = all;
  }

  readonly all = $derived.by(() => this._all());
  readonly dirty = $derived.by(() => this.all.filter((prop) => prop.isDirty));
  readonly valid = $derived.by(() => this.all.filter((prop) => prop.isValid));
  readonly errored = $derived.by(() => this.all.filter((prop) => !prop.isValid));

  readonly isValid = $derived.by(() => this.errored.length === 0);
  readonly isDirty = $derived.by(() => this.dirty.length > 0);
}

export class TouchedProperties {
  private readonly _properties: Properties;
  private readonly _isTouched: () => boolean;

  constructor(properties: Properties, isTouched: () => boolean) {
    this._properties = properties;
    this._isTouched = isTouched;
  }

  private isTouched = $derived.by(() => this._isTouched());

  readonly all = $derived.by(() => this._properties.all);
  readonly valid = $derived.by(() => (this.isTouched ? this._properties.valid : this.all));
  readonly errored = $derived.by(() => (this.isTouched ? this._properties.errored : this.all));

  readonly isValid = $derived.by(() => (this.isTouched ? this._properties.isValid : true));
}

export type UsePropertiesContextOptions = {
  parent?: Parent | undefined;
} & Partial<Parent>;

export class PropertiesContext {
  private readonly _opts: UsePropertiesContextOptions;
  constructor(opts: UsePropertiesContextOptions) {
    this._opts = opts;
  }

  readonly willUpdate = (property: Property<unknown>, pair: PropertyUpdatePair<unknown>) => {
    this._opts.willUpdate?.(property, pair);
    this._opts.parent?.willUpdate(property, pair);
  };

  readonly didUpdate = (property: Property<unknown>, pair: PropertyUpdatePair<unknown>) => {
    this._opts.didUpdate?.(property, pair);
    this._opts.parent?.didUpdate(property, pair);
  };

  isTouched = $state(false);

  private _registered = $state<Property[]>([]);
  readonly properties = new Properties(() => this._registered);
  readonly touched = new TouchedProperties(this.properties, () => this.isTouched);

  readonly errors = $derived.by(() => this.properties.errored.map((p) => p.error).filter(isTruthy));
  readonly isValid = $derived.by(() => this.properties.isValid);
  readonly isDirty = $derived.by(() => this.properties.isDirty);

  touch = () => {
    this.isTouched = true;
    return this.isValid;
  };

  rollback = () => {
    this.properties.all.forEach((property) => property.rollback());
  };

  readonly _register = (property: Property) => {
    addObject(this._registered, property);
    return () => {
      removeObject(this._registered, property);
    };
  };
}

const key = 'properties-context';

export const usePropertiesContext = () => {
  let context;
  if (!hasContext(key)) {
    context = setContext(key, new PropertiesContext({}));
  } else {
    context = getContext(key) as PropertiesContext;
  }
  return context;
};

export const nestPropertiesContext = (opts: Omit<UsePropertiesContextOptions, 'parent'> = {}) => {
  const parent = getContext(key) as PropertiesContext | undefined;
  return setContext(key, new PropertiesContext({ ...opts, parent }));
};
