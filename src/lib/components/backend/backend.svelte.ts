import { page } from '$app/state';
import type { ResolvedPathname } from '$app/types';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { createContext, type Component } from 'svelte';

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
  const route = $derived(opts.route);
  const select = $derived(opts.select);

  const pathname = $derived(page.url.pathname);
  const eq = ['/'];

  const isCurrent = $derived.by(() => {
    if (eq.includes(route)) {
      return route === pathname;
    } else {
      return pathname.startsWith(route);
    }
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
    const section = sections.find((section) => section.isCurrent);
    if (!section) {
      throw new Error('Missing section for current route');
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
