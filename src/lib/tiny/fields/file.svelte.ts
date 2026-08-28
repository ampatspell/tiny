import type { UniversalFile } from '$lib/tiny/utils/files.svelte.js';
import { options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import type { Property } from '../properties/property.svelte.ts';
import type { Field } from './field.svelte.ts';
import { File } from './imports.ts';

export const fileField = (
  _opts: OptionsInput<{ property: Property<UniversalFile | undefined>; accept: string[] }>,
): FileEditor => {
  const opts = options(_opts);

  const property = $derived(opts.property);
  const update = (next: UniversalFile | undefined) => property.update(next);

  const accept = $derived(opts.accept);

  return options(
    {
      property,
      update,
      accept,
      component: File,
    },
    { name: 'FileEditor' },
  );
};

export type FileEditor = Field<UniversalFile | undefined> & {
  accept: string[];
};
