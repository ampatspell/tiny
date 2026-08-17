import { extract, onCleanup, type MaybeGetter } from 'runed';
import { usePropertiesContext, type PropertiesContext } from './context.svelte.ts';
import { untrack } from 'svelte';

export class TouchedProperty {
  private readonly _property: Property;

  constructor(property: Property) {
    this._property = property;
  }

  private readonly isTouched = $derived.by(() => this._property.context.isTouched);

  readonly isValid = $derived.by(() => (this.isTouched ? this._property.isValid : true));
  readonly error = $derived.by(() => (this.isTouched ? this._property.error : undefined));
}

export type PropertyUpdatePair<T> = { before: T; after: T };

export type Validator<T> = {
  validate: (value: T) => string | boolean | undefined;
  isRequired: MaybeGetter<boolean>;
};

export type UsePropertyOptions<T> = {
  readonly value: MaybeGetter<T>;
  readonly passive?: MaybeGetter<boolean>;
  readonly willUpdate?: (opts: PropertyUpdatePair<T>) => void;
  readonly didUpdate?: (opts: PropertyUpdatePair<T>) => void;
  readonly onRollback?: () => void;
  readonly validator?: Validator<T>;
  readonly meta?: { label?: string; isRequired?: boolean };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Property<T = any> {
  private readonly _opts: UsePropertyOptions<T>;
  readonly passive = $derived.by(() => extract(this._opts.passive, false));
  private readonly external = $derived.by(() => extract(this._opts.value));
  private current: T;
  readonly value = $derived.by(() => this.current);
  readonly context: PropertiesContext;

  constructor(opts: UsePropertyOptions<T>) {
    this._opts = opts;
    this.current = $state(this.external);
    $effect.pre(() => {
      if (!this.passive) {
        const external = this.external;
        untrack(() => this.update(external));
      }
    });

    this.context = usePropertiesContext();
    const cancel = this.context._register(this);
    onCleanup(() => cancel());
  }

  readonly update = (after: T) => {
    const before = this.current;
    if (before !== after) {
      const pair = { before, after };
      this._opts.willUpdate?.(pair);
      this.current = after;
      this._opts.didUpdate?.(pair);
    }
  };

  readonly rollback = () => {
    this.update(this.external);
  };

  readonly validator = $derived.by(() => this._opts.validator);

  readonly error = $derived.by(() => {
    const fn = this.validator?.validate;
    if (fn) {
      const res = fn(this.current);
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

  readonly isDirty = $derived.by(() => this.current !== this.external);
  readonly isValid = $derived.by(() => !this.error);

  readonly isTouched = $derived.by(() => this.context.isTouched);
  readonly touched = new TouchedProperty(this);

  readonly meta = $derived.by(() => {
    return Object.assign(
      {
        isRequired: extract(this.validator?.isRequired),
      },
      $state.snapshot(this._opts.meta),
    );
  });
}

export const useProperty = <T>(opts: UsePropertyOptions<T>) => new Property<T>(opts);
