import { useBackend } from '$lib/components/backend/backend.svelte.js';
import type { Snippet } from 'svelte';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';

export type Model = {
  id: string;
};

export type UseListLayoutOptions<M extends Model> = {
  selected: string | undefined;
  models: M[];
  item: Snippet<[model: M]>;
  add: Snippet<[onDone: (id: string | undefined) => void]>;
};

export const useListLayout = <M extends Model>(_opts: OptionsInput<UseListLayoutOptions<M>>) => {
  const opts = options(_opts);
  const backend = useBackend();

  const section = $derived(backend.section);
  const title = $derived(section.name);
  const icon = $derived(section.icon);
  const index = $derived(section.route);
  const select = $derived(section.select);

  const selected = $derived(opts.selected);
  const models = $derived(opts.models);
  const item = $derived(opts.item);
  const add = $derived(opts.add);

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
    },
    {
      name: 'ListLayout',
      serialized: ['title'],
    },
  );
};

export type ListLayout<M extends Model> = ReturnType<typeof useListLayout<M>>;
