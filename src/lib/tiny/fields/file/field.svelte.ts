import type { UniversalFile } from '$lib/tiny/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { File } from '../imports.ts';
import { createMeta, type Field, type FieldOptions } from '../utils.svelte.ts';

export const fileField = (
  _opts: OptionsInput<FieldOptions<UniversalFile | undefined> & { accept: string[] }>,
): FileField => {
  const opts = options(_opts);
  const property = $derived(opts.property);
  const accept = $derived(opts.accept);
  const meta = createMeta(opts);

  return options(
    {
      component: File,
      property: getter(() => property),
      accept: getter(() => accept),
      meta: getter(() => meta),
    },
    { name: 'FileEditor' },
  );
};

export type FileField = Field<UniversalFile | undefined> & {
  accept: string[];
};
