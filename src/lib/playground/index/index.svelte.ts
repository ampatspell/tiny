import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import { createOptionalRemoteFile } from '$lib/utils/files.svelte.js';
import { split } from '$lib/utils/object.js';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';
import { updateIndex, updateIndexFile, type IndexData } from './index.remote.ts';

export type UseIndexPropertiesOptions = {
  data: IndexData;
};

export const useIndexProperties = (_opts: OptionsInput<UseIndexPropertiesOptions>) => {
  const opts = options(_opts);

  const data = $derived(opts.data);

  const properties = useDataProperties({
    data: getter(() => ({
      ...data,
      background: createOptionalRemoteFile(data.background),
    })),
  });

  const title = properties.property('title', { validator: notBlank() });
  const description = properties.property('description');
  const background = properties.property('background');

  const isDirty = $derived(properties.isDirty);

  const save = async () => {
    if (properties.touch()) {
      const dirty = properties.dirty;
      if (dirty) {
        const [data, files] = split(dirty, ['background']);
        if (Object.keys(data).length) {
          await updateIndex(data);
        }
        const file = files.background;
        if (file) {
          await updateIndexFile({ file: file.file });
        }
      }
      return data.id;
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
