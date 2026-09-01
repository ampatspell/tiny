import { useBackend } from '#lib/tiny/backend/context.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';

export type Model = {
  isDirty: boolean;
  save: () => Promise<string | void | undefined>;
  rollback: () => void;
  destroy?: () => Promise<void>;
};

export type EditingLayoutOptions<M extends Model> = {
  title: string;
  model: M;
};

export const useEditingLayout = <P extends Model>(_opts: OptionsInput<EditingLayoutOptions<P>>) => {
  const opts = options(_opts);
  const backend = useBackend();

  const item = $derived(backend.item);
  const route = $derived(item.route);

  const title = $derived(opts.title);
  const model = $derived(opts.model);

  return options({
    title: getter(() => title),
    model: getter(() => model),
    route: getter(() => route),
  });
};

export type EditingLayout<M extends Model> = ReturnType<typeof useEditingLayout<M>>;
