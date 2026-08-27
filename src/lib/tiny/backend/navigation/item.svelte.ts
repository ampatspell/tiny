import { match } from '$app/paths';
import { page } from '$app/state';
import type { ResolvedPathname } from '$app/types';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { run } from '$lib/tiny/utils/utils.js';
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
  let id = $state<string>();

  $effect(() => {
    void route;
    run(async () => {
      const matched = await match(route);
      if (matched) {
        id = matched.id;
      }
    });
  });

  const eq = ['/'];

  const isCurrent = $derived.by(() => {
    const route = page.route.id;
    if (id && route) {
      if (eq.includes(id)) {
        return id === route;
      } else {
        return route.startsWith(id);
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
