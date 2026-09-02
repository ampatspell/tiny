import { untrack } from 'svelte';
import { getter, options, type OptionsInput } from '../utils/options.svelte.ts';
import type { Property, PropertyUpdatePair } from './property.svelte.ts';
import { addObject, isTruthy, removeObject } from '../utils/array.ts';

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

export const createPropertiesContext = (_opts?: OptionsInput<UsePropertiesContextOptions>) => {
  const opts = options(_opts ?? {});

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
    untrack(() => addObject(registered, property));
    return () => {
      untrack(() => removeObject(registered, property));
    };
  };

  const identity = options(
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
      nest: (opts?: OptionsInput<Omit<UsePropertiesContextOptions, 'parent'>>) => {
        return createPropertiesContext({ ...opts, parent: identity });
      },
      _register,
    },
    {
      name: 'PropertiesContext',
      serialized: ['isDirty', 'isValid'],
    },
  );

  return identity;
};

export type PropertiesContext = ReturnType<typeof createPropertiesContext>;
