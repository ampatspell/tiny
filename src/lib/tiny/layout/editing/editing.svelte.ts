import { useBackend } from '$lib/tiny/backend/backend.svelte.js';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';

export type Properties = {
  isDirty: boolean;
  save: () => Promise<string | undefined>;
  rollback: () => void;
  destroy?: () => Promise<void>;
};

export type EditingLayoutOptions<P extends Properties> = {
  title: string;
  properties: P;
};

export const useEditingLayout = <P extends Properties>(_opts: OptionsInput<EditingLayoutOptions<P>>) => {
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

export type EditingLayout<P extends Properties> = ReturnType<typeof useEditingLayout<P>>;
