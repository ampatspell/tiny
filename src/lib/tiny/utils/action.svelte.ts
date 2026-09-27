import { getter, Model } from './options.svelte.js';

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

type Blank = 'hides' | 'disables';
export const fromOptional = <T>(
  parent: Action<T | undefined> | undefined,
  parentBlank?: Blank,
  actionBlank?: Blank,
) => {
  const noParent = !parent;
  const noAction = !parent?.action;
  const isDisabled = getter(() => {
    if (noParent && parentBlank === 'disables') {
      return true;
    } else if (noAction && actionBlank === 'disables') {
      return true;
    }
    return parent?.isDisabled ?? false;
  });
  const isHidden = getter(() => {
    if (noParent && parentBlank === 'hides') {
      return true;
    } else if (noAction && actionBlank === 'hides') {
      return true;
    }
    return parent?.isHidden ?? false;
  });
  return new Action<T | undefined>({
    action: getter(() => parent?.action),
    isDisabled,
    isHidden,
  });
};
