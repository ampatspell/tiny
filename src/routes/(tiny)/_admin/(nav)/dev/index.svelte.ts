import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldDefinitions, type FieldDefinitionsRecord } from './definitions.svelte.ts';
import type { Factory } from './factory.svelte.ts';

export type Data = Record<string, unknown>;

export const withDataFields = <D extends Data>(_opts: OptionsInput<{ data: D }>) => {
  const opts = options(_opts);

  const create = <R extends FieldDefinitionsRecord<D>>(cb: (factory: Factory<D>) => R) => {
    return new FieldDefinitions<D, R>({ cb });
  };

  const define = <R extends FieldDefinitionsRecord<D>>(cb: (factory: Factory<D>) => R) => {
    return create<R>(cb).build({ data: getter(() => opts.data) });
  };

  return {
    create,
    define,
  };
};
