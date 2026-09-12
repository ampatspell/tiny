import { useBackend } from '#lib/tiny/backend/context.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { ResolvedPathname } from '$app/types';

export type Model = {
  title: string;
  isDirty: boolean;
  route: ResolvedPathname | undefined | null;
  save: () => Promise<string | void | undefined>;
  rollback: () => void;
  destroy?: () => Promise<void>;
};

export type EditingLayoutOptions<M extends Model> = {
  model: M;
};

export const useEditingLayout = <P extends Model>(_opts: OptionsInput<EditingLayoutOptions<P>>) => {
  const opts = options(_opts);
  const backend = useBackend();

  const item = $derived(backend.item);
  const admin = $derived(item.route);
  const frontend = $derived(opts.model.route);

  const model = $derived(opts.model);
  const title = $derived(model.title);
  const isDirty = $derived(model.isDirty);
  const save = $derived(model.save);
  const rollback = $derived(model.rollback);

  let isDestroyed = $state(false);

  const destroy = $derived.by(() => {
    const fn = opts.model.destroy;
    if (fn) {
      return async () => {
        await fn();
        isDestroyed = true;
      };
    }
  });

  return options({
    title: getter(() => title),
    isDirty: getter(() => isDirty),
    isDestroyed: getter(() => isDestroyed),
    admin: getter(() => admin),
    frontend: getter(() => frontend),
    save: getter(() => save),
    rollback: getter(() => rollback),
    destroy: getter(() => destroy),
  });
};

export type EditingLayout<M extends Model> = ReturnType<typeof useEditingLayout<M>>;
