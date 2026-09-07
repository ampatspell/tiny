import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldsContext } from './context.svelte.ts';
import { FieldsDefinition, type FieldsDefinitionRecord } from './definitions.svelte.ts';
import type { Factory } from './factory.svelte.ts';

export type Data = Record<string, unknown>;

export type WithDataFieldsOptions<D> = { data: D; context?: FieldsContext };

export const withDataFields = <D extends Data>(_opts: OptionsInput<WithDataFieldsOptions<D>>) => {
  const opts = options(_opts);
  const context = $derived(opts.context ?? new FieldsContext());

  const create = <R extends FieldsDefinitionRecord<D>>(cb: (factory: Factory<D>) => R) => {
    return new FieldsDefinition<D, R>({
      context: getter(() => context),
      cb,
    });
  };

  const define = <R extends FieldsDefinitionRecord<D>>(cb: (factory: Factory<D>) => R) => {
    return create<R>(cb).fields({
      data: getter(() => opts.data),
    });
  };

  return {
    create,
    define,
  };
};
