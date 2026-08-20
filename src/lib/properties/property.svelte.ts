import { onCleanup } from 'runed';
import { usePropertiesContext, type PropertiesContext } from './context.svelte.ts';
import { untrack } from 'svelte';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';

export const hashCodeTag = Symbol('hash-code');

const hasHashCodeTag = (obj: unknown) => {
  return typeof obj === 'object' && obj !== null && hashCodeTag in obj;
};

export const equals = (a: unknown, b: unknown) => {
  if (hasHashCodeTag(a) && hasHashCodeTag(b)) {
    return a[hashCodeTag] === b[hashCodeTag];
  }
  return a === b;
};

export type UseTouchedPropertyOptions = {
  context: PropertiesContext;
  isValid: boolean;
  error: string | undefined;
};

export const useTouchedProperty = (_opts: OptionsInput<UseTouchedPropertyOptions>) => {
  const opts = options(_opts);

  const isTouched = $derived(opts.context.isTouched);
  const isValid = $derived(isTouched ? opts.isValid : true);
  const error = $derived(isTouched ? opts.error : undefined);

  return options({
    isTouched: getter(() => isTouched),
    isValid: getter(() => isValid),
    error: getter(() => error),
  });
};

export type TouchedProperty = ReturnType<typeof useTouchedProperty>;

export type PropertyUpdatePair<T> = { before: T; after: T };

export type Validator<T> = {
  validate: (value: T) => string | boolean | undefined;
  isRequired: boolean;
};

export type UsePropertyOptions<T> = {
  readonly value: T;
  readonly passive?: boolean;
  readonly willUpdate?: (opts: PropertyUpdatePair<T>) => void;
  readonly didUpdate?: (opts: PropertyUpdatePair<T>) => void;
  readonly onRollback?: () => void;
  readonly validator?: Validator<T>;
  readonly meta?: {
    label?: string;
    description?: string;
    isRequired?: boolean;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useProperty = <T = any>(_opts: OptionsInput<UsePropertyOptions<T>>) => {
  const opts = options(_opts);
  const passive = $derived(opts.passive ?? false);
  const external = $derived(opts.value);
  let current = $state<T>(untrack(() => external));
  const value = $derived(current);

  const update = (after: T) => {
    const before = current;
    if (!equals(before, after)) {
      const pair = { before, after };
      opts.willUpdate?.(pair);
      current = after;
      opts.didUpdate?.(pair);
    }
  };

  const rollback = () => {
    update(external);
  };

  const validator = $derived(opts.validator);
  const error = $derived.by(() => {
    const fn = validator?.validate;
    if (fn) {
      const res = fn(current);
      if (typeof res === 'string' && res === '') {
        throw new Error(`Don't use blank string as an validation result. It is ambiguous`);
      }
      if (typeof res === 'boolean') {
        if (!res) {
          return 'Not valid';
        } else {
          return undefined;
        }
      }
      return res;
    }
    return undefined;
  });

  const isDirty = $derived(!equals(current, external));
  const isValid = $derived(!error);
  const isTouched = $derived.by(() => context.isTouched);
  const touched = useTouchedProperty({
    context: getter(() => context),
    error: getter(() => error),
    isValid: getter(() => isValid),
  });
  const meta = $derived.by(() => {
    return { isRequired: validator?.isRequired ?? false, ...opts.meta };
  });

  const identity = options(
    {
      value: getter(() => value),
      update,
      rollback,
      isDirty: getter(() => isDirty),
      isValid: getter(() => isValid),
      error: getter(() => error),
      isTouched: getter(() => isTouched),
      touched: getter(() => touched),
      meta: getter(() => meta),
    },
    {
      name: 'Property',
      serialized: ['value', 'isDirty', 'isValid'],
    },
  );

  const context = usePropertiesContext();
  const cancel = context._register(identity);
  onCleanup(() => cancel());

  $effect.pre(() => {
    if (!passive) {
      void external;
      untrack(() => update(external));
    }
  });

  return identity;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Property<T = any> = {
  value: T;
  update: (after: T) => void;
  rollback: () => void;
  isDirty: boolean;
  isValid: boolean;
  error: string | undefined;
  isTouched: boolean;
  touched: TouchedProperty;
  meta: {
    label?: string | undefined;
    description?: string | undefined;
    isRequired?: boolean | undefined;
  };
};
