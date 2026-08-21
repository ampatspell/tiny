import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';
import { createContext, type Component } from 'svelte';

export type DynamicEntityOptions = {
  id: string;
  name: string;
  icon: Component;
};

export type DynamicOneEntityOptions = DynamicEntityOptions & {
  content: Component;
};

export type DynamicManyEntityOptions = DynamicEntityOptions & {};

export const createOneEntity = (_opts: OptionsInput<DynamicOneEntityOptions>) => {
  const opts = options(_opts);

  const id = $derived(opts.id);
  const name = $derived(opts.name);
  const icon = $derived(opts.icon);
  const content = $derived(opts.content);

  return options(
    {
      type: 'one' as const,
      id: getter(() => id),
      name: getter(() => name),
      icon: getter(() => icon),
      content: getter(() => content),
    },
    { name: 'DynamicOneEntity', serialized: ['id'] },
  );
};

export type DynamicOneEntity = ReturnType<typeof createOneEntity>;

export const createManyEntity = (_opts: OptionsInput<DynamicManyEntityOptions>) => {
  const opts = options(_opts);

  const id = $derived(opts.id);
  const name = $derived(opts.name);
  const icon = $derived(opts.icon);

  return options(
    {
      type: 'many' as const,
      id: getter(() => id),
      name: getter(() => name),
      icon: getter(() => icon),
    },
    { name: 'DynamicManyEntity', serialized: ['id'] },
  );
};

export type DynamicManyEntity = ReturnType<typeof createManyEntity>;

export type DynamicEntity = DynamicOneEntity | DynamicManyEntity;

export type DynamicOptions = {
  entities: DynamicEntity[];
};

const createDynamic = (_opts: OptionsInput<DynamicOptions>) => {
  const opts = options(_opts);

  const entities = $derived(opts.entities);

  const entityById = (id: string | undefined) => {
    return entities.find((entity) => entity.id === id);
  };

  return options(
    {
      entities: getter(() => entities),
      entityById,
    },
    { name: 'Dynamic' },
  );
};

export type Dynamic = ReturnType<typeof createDynamic>;

const [get, set] = createContext<Dynamic>();

export const setDynamic = (...args: Parameters<typeof createDynamic>) => set(createDynamic(...args));
export const useDynamic = () => get();
