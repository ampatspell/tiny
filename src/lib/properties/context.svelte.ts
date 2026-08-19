import { getContext, hasContext, setContext } from 'svelte';
import type { Property, PropertyUpdatePair } from './property.svelte.ts';
import { addObject, isTruthy, removeObject } from '$lib/utils/array.js';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';

export type UpdateParams<T> = [property: Property<T>, pair: PropertyUpdatePair<T>];

export type Parent = {
  willUpdate: (...args: UpdateParams<unknown>) => void;
  didUpdate: (...args: UpdateParams<unknown>) => void;
};

type UsePropertiesOptions = {
  all: Property[];
};

const useProperties = (_opts: OptionsInput<UsePropertiesOptions>) => {
  const opts = options(_opts);

  const all = $derived(opts.all);
  const dirty = $derived(all.filter((prop) => prop.isDirty));
  const valid = $derived(all.filter((prop) => prop.isValid));
  const errored = $derived(all.filter((prop) => !prop.isValid));

  const isValid = $derived(errored.length === 0);
  const isDirty = $derived(dirty.length > 0);

  return options({
    all: getter(() => all),
    dirty: getter(() => dirty),
    valid: getter(() => valid),
    errored: getter(() => errored),
    isValid: getter(() => isValid),
    isDirty: getter(() => isDirty),
  });
};

export type Properties = ReturnType<typeof useProperties>;

type UseTouchedPropertiesOptions = {
  properties: Properties;
  isTouched: boolean;
};

const useTouchedProperties = (_opts: OptionsInput<UseTouchedPropertiesOptions>) => {
  const opts = options(_opts);
  const isTouched = $derived(opts.isTouched);
  const properties = $derived(opts.properties);

  const all = $derived(properties.all);
  const valid = $derived(isTouched ? properties.valid : all);
  const errored = $derived(isTouched ? properties.errored : all);

  const isValid = $derived(isTouched ? properties.isValid : true);

  return options({
    all: getter(() => all),
    valid: getter(() => valid),
    errored: getter(() => errored),
    isValid: getter(() => isValid),
  });
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
  const registered = $state<Property[]>([]);
  const properties = useProperties({ all: getter(() => registered) });
  const touched = useTouchedProperties({ properties, isTouched: getter(() => isTouched) });

  const errors = $derived(properties.errored.map((p) => p.error).filter(isTruthy));
  const isValid = $derived(properties.isValid);
  const isDirty = $derived(properties.isDirty);
  const touch = () => {
    isTouched = true;
    return isValid;
  };

  const rollback = () => {
    properties.all.forEach((property) => property.rollback());
  };

  const _register = (property: Property) => {
    addObject(registered, property);
    return () => {
      removeObject(registered, property);
    };
  };

  return options(
    {
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
    },
    {
      name: 'PropertiesContext',
      serialized: ['isDirty', 'isValid'],
    },
  );
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
