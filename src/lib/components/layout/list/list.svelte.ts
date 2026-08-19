import type { ResolvedPathname } from '$app/types';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';
import type { Snippet } from 'svelte';

export type Model = {
  id: string;
};

export type UseListLayoutOptions<M extends Model> = {
  title: string;
  selected: string | undefined;
  index: ResolvedPathname;
  select: (id: string) => ResolvedPathname;
  models: M[];
  item: Snippet<[model: M]>;
  add: Snippet<[onDone: (id: string | undefined) => void]>;
};

export const useListLayout = <M extends Model>(_opts: OptionsInput<UseListLayoutOptions<M>>) => {
  const opts = options(_opts);

  const title = $derived(opts.title);
  const selected = $derived(opts.selected);
  const index = $derived(opts.index);
  const select = $derived(opts.select);
  const models = $derived(opts.models);
  const item = $derived(opts.item);
  const add = $derived(opts.add);

  return options(
    {
      title: getter(() => title),
      selected: getter(() => selected),
      index: getter(() => index),
      select: getter(() => select),
      models: getter(() => models),
      item: getter(() => item),
      add: getter(() => add),
    },
    {
      name: 'ListLayout',
      serialized: ['title'],
    },
  );
};

export type ListLayout<M extends Model> = ReturnType<typeof useListLayout<M>>;
