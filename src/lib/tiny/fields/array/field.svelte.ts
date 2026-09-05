import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { createMeta, type Field, type FieldOptions } from '../utils.svelte.ts';
import Array from './array.svelte';

export const arrayField = <A extends object[]>(_opts: OptionsInput<FieldOptions<A>>): ArrayField<A> => {
  const opts = options(_opts);
  const property = $derived(opts.property);
  const meta = createMeta(opts);

  const serialized = $derived.by(() => {
    return {
      ok: true,
    };
  });

  return options(
    {
      component: Array,
      serialized: getter(() => serialized),
      isDirty: getter(() => property.isDirty),
      value: getter(() => property.value),
      update: (next: A) => property.update(next),
      meta: getter(() => meta),
    },
    { name: 'ArrayField' },
  );
};

export type ArrayField<A> = Field<A, { ok: boolean }>;
