import { extract, type MaybeGetter } from 'runed';
import { untrack } from 'svelte';

export type PropertyUpdatePair<T> = { before: T; after: T };

export type UsePropertyOptions<T> = {
  value: MaybeGetter<T>;
  passive?: MaybeGetter<boolean>;
  willUpdate?: (opts: PropertyUpdatePair<T>) => void;
  didUpdate?: (opts: PropertyUpdatePair<T>) => void;
  onRollback?: () => void;
  validate?: (value: T) => string | boolean | undefined;
};

export class Property<T> {
  private readonly _opts: UsePropertyOptions<T>;
  readonly passive = $derived.by(() => extract(this._opts.passive, false));
  private readonly external = $derived.by(() => extract(this._opts.value));
  private current: T;
  readonly value = $derived.by(() => this.current);

  constructor(opts: UsePropertyOptions<T>) {
    this._opts = opts;
    this.current = $state(this.external);
    $effect.pre(() => {
      if (!this.passive) {
        const external = this.external;
        untrack(() => this.update(external));
      }
    });
  }

  update(after: T) {
    const before = this.current;
    if (before !== after) {
      const pair = { before, after };
      this._opts.willUpdate?.(pair);
      this.current = after;
      this._opts.didUpdate?.(pair);
    }
  }

  rollback() {
    this.update(this.external);
  }

  readonly error = $derived.by(() => {
    const fn = this._opts.validate;
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
}

export const useProperty = <T>(opts: UsePropertyOptions<T>) => new Property(opts);
