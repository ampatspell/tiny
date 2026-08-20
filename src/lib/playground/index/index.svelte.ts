import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import { asFile } from '$lib/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';
import { run } from '$lib/utils/utils.js';
import { updateIndex, updateIndexFile, type IndexData } from './index.remote.ts';

export type UseIndexPropertiesOptions = {
  data: IndexData;
};

export const useIndexProperties = (_opts: OptionsInput<UseIndexPropertiesOptions>) => {
  const opts = options(_opts);

  const data = $derived(opts.data);
  const id = $derived(data.id);

  const properties = useDataProperties({
    data: getter(() => ({
      ...data,
      background: asFile(data.background),
    })),
  });

  const title = properties.property('title', { validator: notBlank() });
  const description = properties.property('description');
  const background = properties.property('background');

  const isDirty = $derived(properties.isDirty);

  const save = async () => {
    if (properties.touch()) {
      const { omit: data, pick: files } = properties.with('background').dirty;
      await Promise.all([
        run(async () => {
          if (data) {
            await updateIndex(data);
          }
        }),
        run(async () => {
          if (files) {
            await updateIndexFile({ file: files.background?.file });
          }
        }),
      ]);
      return id;
    }
  };

  const rollback = () => properties.rollback();

  return options(
    {
      title,
      description,
      background,
      isDirty: getter(() => isDirty),
      save,
      rollback,
    },
    {
      name: 'IndexProperties',
    },
  );
};

export type IndexProperties = ReturnType<typeof useIndexProperties>;
