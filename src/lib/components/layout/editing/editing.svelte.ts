import { useBackend } from '$lib/components/backend/backend.svelte.js';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';

export type Model = { id: string };

export type Properties = {
  isDirty: boolean;
  save: () => Promise<string | undefined>;
  rollback: () => void;
  destroy?: () => Promise<void>;
};

export type EditingLayoutOptions<M extends Model, P extends Properties> = {
  title: string;
  data: M;
  properties: P;
};

export const useEditingLayout = <M extends Model, P extends Properties>(
  _opts: OptionsInput<EditingLayoutOptions<M, P>>,
) => {
  const opts = options(_opts);
  const backend = useBackend();

  const section = $derived(backend.section);
  const route = $derived(section.route);

  const title = $derived(opts.title);
  const properties = $derived(opts.properties);

  return options({
    title: getter(() => title),
    properties: getter(() => properties),
    route: getter(() => route),
  });
};

export type EditingLayout<M extends Model, P extends Properties> = ReturnType<typeof useEditingLayout<M, P>>;
