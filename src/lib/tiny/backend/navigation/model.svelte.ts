import { page } from '$app/state';
import type { ResolvedPathname } from '$app/types';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Component } from 'svelte';

export type NavigationItemOptions = {
  icon: Component;
  name: string;
  route: ResolvedPathname;
  select?: (id: string) => ResolvedPathname;
};

export const createItem = (_opts: OptionsInput<NavigationItemOptions>) => {
  const opts = options(_opts);

  const icon = $derived(opts.icon);
  const name = $derived(opts.name);
  const select = $derived(opts.select);
  const route = $derived(opts.route);

  const eq = ['/'];

  const isCurrent = $derived.by(() => {
    const pathname = page.url.pathname;
    if (pathname) {
      if (eq.includes(route)) {
        return route === pathname;
      } else {
        return pathname.startsWith(route);
      }
    }
    return false;
  });

  return options(
    {
      icon: getter(() => icon),
      name: getter(() => name),
      route: getter(() => route),
      select: getter(() => select),
      isCurrent: getter(() => isCurrent),
    },
    { name: 'Item', serialized: ['name', 'isCurrent'] },
  );
};

export type Item = ReturnType<typeof createItem>;
