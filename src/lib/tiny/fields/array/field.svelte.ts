import type { Data } from '#lib/tiny/properties/data.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { withDataFields } from '../data.svelte.ts';
import { createMeta, type Field, type FieldOptions } from '../utils.svelte.ts';
import Array from './array.svelte';

export const arrayField = <A extends Data[]>(_opts: OptionsInput<FieldOptions<A>>): ArrayField<A> => {
  const opts = options(_opts);
  const property = $derived(opts.property);
  const meta = createMeta(opts);

  const serialized = $derived.by(() => {
    return {
      ok: true,
    };
  });

  const items = $derived.by(() => {
    return property.value.map((data) => {
      return withDataFields<A[number]>({ data: getter(() => data) });
    });
  });

  return options(
    {
      component: Array,
      property: getter(() => property),
      items: getter(() => items),
      serialized: getter(() => serialized),
      meta: getter(() => meta),
    },
    { name: 'ArrayField' },
  );
};

export type ArrayField<A> = Field<A, { ok: boolean }>;
