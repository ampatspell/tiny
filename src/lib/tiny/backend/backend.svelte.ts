import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { createContext } from 'svelte';
import { createItem, type Item, type NavigationItemOptions } from './navigation/item.svelte.ts';

const [get, set] = createContext<Backend>();

export const setBackend = (opts: OptionsInput<BackendOptions>) => set(createBackend(opts));
export const useBackend = () => get();

export type BackendOptions = {
  items: OptionsInput<NavigationItemOptions>[];
};

const createBackend = (_opts: OptionsInput<BackendOptions>) => {
  const opts = options(_opts);

  const items = $derived(opts.items.map((section) => createItem(section)));

  const placeholder: Item = {
    icon: items[0].icon,
    isCurrent: true,
    name: 'Loading…',
    route: '/',
    select: () => '/',
  };

  const item = $derived.by(() => {
    let section = items.find((section) => section.isCurrent);
    if (!section) {
      section = placeholder;
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
