import { Model } from './options.svelte.js';

export type ActionOptions<T> = {
  isDisabled?: boolean;
  isHidden?: boolean;
  action: T;
};

export class Action<T> extends Model<ActionOptions<T>> {
  readonly isDisabled = $derived(this.opts.isDisabled ?? false);
  readonly isHidden = $derived(this.opts.isHidden ?? false);
  readonly action = $derived(this.opts.action);
}

export const asAction = <T>(action: T) => new Action<T>({ action });
export const useAction = <T>(...args: ConstructorParameters<typeof Action<T>>) => new Action<T>(...args);
