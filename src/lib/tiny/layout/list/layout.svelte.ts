import { useBackend } from '#lib/tiny/backend/context.svelte.js';
import type { IsFunction, IsSnippet } from '#lib/tiny/utils/is.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { ResolvedPathname } from '$app/types';
import type { Snippet } from 'svelte';

export type Model = {
  id: string;
};

type AddSnippet = Snippet<[onDone: (id: string | undefined) => void]>;

export type UseListLayoutOptions<M extends Model> = {
  selected: string | undefined;
  models: M[];
  item: Snippet<[model: M]>;
  add?: IsSnippet<AddSnippet> | IsFunction<() => Promise<unknown>>;
  route?: ResolvedPathname | null;
};

export const useListLayout = <M extends Model>(_opts: OptionsInput<UseListLayoutOptions<M>>) => {
  const opts = options(_opts);
  const backend = useBackend();

  const nav = $derived(backend.item);
  const title = $derived(nav.name);
  const icon = $derived(nav.icon);
  const index = $derived(nav.route);
  const select = $derived(nav.select);

  const selected = $derived(opts.selected);
  const models = $derived(opts.models);
  const item = $derived(opts.item);
  const add = $derived(opts.add);
  const route = $derived(opts.route);

  return options(
    {
      title: getter(() => title),
      icon: getter(() => icon),
      index: getter(() => index),
      select: getter(() => select),
      selected: getter(() => selected),
      models: getter(() => models),
      item: getter(() => item),
      add: getter(() => add),
      route: getter(() => route),
    },
    {
      name: 'ListLayout',
      serialized: ['title'],
    },
  );
};

export type ListLayout<M extends Model> = ReturnType<typeof useListLayout<M>>;
