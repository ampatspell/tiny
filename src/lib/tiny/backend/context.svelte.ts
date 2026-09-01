import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { createContext } from 'svelte';
import { createItem, type NavigationItemOptions } from './navigation/model.svelte.ts';

const [get, set] = createContext<Backend>();

export const setBackend = (opts: OptionsInput<BackendOptions>) => set(createBackend(opts));
export const useBackend = () => get();

export type BackendOptions = {
  items: OptionsInput<NavigationItemOptions>[];
};

const createBackend = (_opts: OptionsInput<BackendOptions>) => {
  const opts = options(_opts);

  const items = $derived(opts.items.map((section) => createItem(section)));

  const item = $derived.by(() => {
    const section = items.find((section) => section.isCurrent);
    if (!section) {
      throw new Error('Current backend session not defined');
    }
    return section;
  });

  return options(
    {
      items: getter(() => items),
      item: getter(() => item),
    },
    {
      name: 'Backend',
    },
  );
};

export type Backend = ReturnType<typeof createBackend>;
