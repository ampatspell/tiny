import { page } from '$app/state';
import type { ResolvedPathname } from '$app/types';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Component } from 'svelte';

export type Comparator = (current: string, route: string) => boolean;

export const startsWith: Comparator = (current, route) => current.startsWith(route);
export const equals: Comparator = (current, route) => current === route;

export type NavigationItemOptions = {
  icon: Component;
  name: string;
  route: ResolvedPathname;
  cmp?: Comparator;
  select?: (id: string) => ResolvedPathname;
};

export const createItem = (_opts: OptionsInput<NavigationItemOptions>) => {
  const opts = options(_opts);

  const icon = $derived(opts.icon);
  const name = $derived(opts.name);
  const select = $derived(opts.select);
  const route = $derived(opts.route);

  const isCurrent = $derived.by(() => {
    const pathname = page.url.pathname;
    if (pathname) {
      const cmp = opts.cmp ?? startsWith;
      return cmp(pathname, route);
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
