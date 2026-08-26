import { match } from '$app/paths';
import { page } from '$app/state';
import type { ResolvedPathname } from '$app/types';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { createContext, type Component } from 'svelte';
import { run } from '../utils/utils.ts';

const [get, set] = createContext<Backend>();

export const setBackend = (opts: OptionsInput<BackendOptions>) => set(createBackend(opts));
export const useBackend = () => get();

export type SectionOptions = {
  icon: Component;
  name: string;
  route: ResolvedPathname;
  select?: (id: string) => ResolvedPathname;
};

export const createSection = (_opts: OptionsInput<SectionOptions>) => {
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
    { name: 'Section', serialized: ['name', 'isCurrent'] },
  );
};

export type Section = ReturnType<typeof createSection>;

export type BackendOptions = {
  sections: OptionsInput<SectionOptions>[];
};

const createBackend = (_opts: OptionsInput<BackendOptions>) => {
  const opts = options(_opts);

  const sections = $derived(opts.sections.map((section) => createSection(section)));

  const section = $derived.by(() => {
    let section = sections.find((section) => section.isCurrent);
    if (!section) {
      // TODO: this is weird
      section = {
        icon: sections[0].icon,
        isCurrent: true,
        name: 'Loading…',
        route: '/',
        select: () => '/',
      };
    }
    return section;
  });

  return options(
    {
      sections: getter(() => sections),
      section: getter(() => section),
    },
    {
      name: 'Backend',
      serialized: ['section'],
    },
  );
};

export type Backend = ReturnType<typeof createBackend>;
