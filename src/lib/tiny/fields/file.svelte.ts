import type { UniversalFile } from '$lib/tiny/utils/files.svelte.js';
import { options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { createMeta, type Field, type FieldOptions } from './field.svelte.ts';
import { File } from './imports.ts';

export const fileField = (
  _opts: OptionsInput<FieldOptions<UniversalFile | undefined> & { accept: string[] }>,
): FileEditor => {
  const opts = options(_opts);
  const property = $derived(opts.property);
  const accept = $derived(opts.accept);
  const meta = createMeta(opts);

  return options(
    {
      component: File,
      property,
      accept,
      meta,
    },
    { name: 'FileEditor' },
  );
};

export type FileEditor = Field<UniversalFile | undefined> & {
  accept: string[];
};
