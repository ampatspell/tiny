import { getContext, hasContext, setContext } from 'svelte';
import type { Property, PropertyUpdatePair } from './property.svelte.ts';
import { addObject, isTruthy, removeObject } from '$lib/utils/array.js';
import { getter, options, type OptionsInput } from '$lib/utils/options.js';

export type UpdateParams<T> = [property: Property<T>, pair: PropertyUpdatePair<T>];

export type Parent = {
  willUpdate: (...args: UpdateParams<unknown>) => void;
  didUpdate: (...args: UpdateParams<unknown>) => void;
};

export type UsePropertiesOptions = {
  all: Property[];
};

export const useProperties = (_opts: OptionsInput<UsePropertiesOptions>) => {
  const opts = options(_opts);

  const all = $derived(opts.all);
  const dirty = $derived(all.filter((prop) => prop.isDirty));
  const valid = $derived(all.filter((prop) => prop.isValid));
  const errored = $derived(all.filter((prop) => !prop.isValid));

  const isValid = $derived(errored.length === 0);
  const isDirty = $derived(dirty.length > 0);

  return {
    all,
    dirty,
    valid,
    errored,
    isValid,
    isDirty,
  };
};

export type Properties = ReturnType<typeof useProperties>;

export type UseTouchedPropertiesOptions = {
  properties: Properties;
  isTouched: boolean;
};

export const useTouchedProperties = (_opts: OptionsInput<UseTouchedPropertiesOptions>) => {
  const opts = options(_opts);
  const isTouched = $derived(opts.isTouched);
  const properties = $derived(opts.properties);

  const all = $derived(properties.all);
  const valid = $derived(isTouched ? properties.valid : all);
  const errored = $derived(isTouched ? properties.errored : all);

  const isValid = $derived(isTouched ? properties.isValid : true);

  return {
    all,
    valid,
    errored,
    isValid,
  };
};

export type TouchedProperties = ReturnType<typeof useTouchedProperties>;

export type UsePropertiesContextOptions = {
  parent?: Parent | undefined;
} & Partial<Parent>;

const createPropertiesContext = (_opts: OptionsInput<UsePropertiesContextOptions>) => {
  const opts = options(_opts);

  const willUpdate = (property: Property<unknown>, pair: PropertyUpdatePair<unknown>) => {
    opts.willUpdate?.(property, pair);
    opts.parent?.willUpdate(property, pair);
  };

  const didUpdate = (property: Property<unknown>, pair: PropertyUpdatePair<unknown>) => {
    opts.didUpdate?.(property, pair);
    opts.parent?.didUpdate(property, pair);
  };

  let isTouched = $state(false);
  const _registered = $state.raw<Property[]>([]);
  const properties = useProperties({ all: getter(() => _registered) });
  const touched = useTouchedProperties({ properties, isTouched: getter(() => isTouched) });

  const errors = $derived.by(() => properties.errored.map((p) => p.error).filter(isTruthy));
  const isValid = $derived.by(() => properties.isValid);
  const isDirty = $derived.by(() => properties.isDirty);
  const touch = () => {
    isTouched = true;
    return isValid;
  };

  const rollback = () => {
    properties.all.forEach((property) => property.rollback());
  };

  const _register = (property: Property) => {
    addObject(_registered, property);
    return () => {
      removeObject(_registered, property);
    };
  };

  return options({
    willUpdate,
    didUpdate,
    isTouched: getter(() => isTouched),
    properties: getter(() => properties),
    touched: getter(() => touched),
    errors: getter(() => errors),
    isValid: getter(() => isValid),
    isDirty: getter(() => isDirty),
    touch,
    rollback,
    _register,
  });
};

export type PropertiesContext = ReturnType<typeof createPropertiesContext>;

const key = 'properties-context';

export const usePropertiesContext = () => {
  let context;
  if (!hasContext(key)) {
    context = setContext(key, createPropertiesContext({}));
  } else {
    context = getContext(key) as PropertiesContext;
  }
  return context;
};

export const nestPropertiesContext = (opts: Omit<UsePropertiesContextOptions, 'parent'> = {}) => {
  const parent = getContext(key) as PropertiesContext | undefined;
  return setContext(key, createPropertiesContext({ ...opts, parent }));
};
