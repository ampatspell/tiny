import type { UniversalFile } from '#lib/tiny/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { createMeta, type Field, type FieldOptions } from '../utils.svelte.ts';
import File from './file.svelte';

export const fileField = (
  _opts: OptionsInput<FieldOptions<UniversalFile | undefined> & { accept: string[] }>,
): FileField => {
  const opts = options(_opts);
  const property = $derived(opts.property);
  const accept = $derived(opts.accept);
  const meta = createMeta(opts);

  const serialized = $derived.by(() => {
    let { value } = property;
    return {
      file: value?.file,
    };
  });

  return options(
    {
      component: File,
      serialized: getter(() => serialized),
      property: getter(() => property),
      accept: getter(() => accept),
      meta: getter(() => meta),
    },
    { name: 'FileField' },
  );
};

export type FileField = Field<UniversalFile | undefined, { file: globalThis.File | undefined }> & {
  accept: string[];
};
