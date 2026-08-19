import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';
import { updateIndex, type IndexData } from './index.remote.ts';

export type UseIndexPropertiesOptions = {
  data: IndexData;
};

export const useIndexProperties = (_opts: OptionsInput<UseIndexPropertiesOptions>) => {
  const opts = options(_opts);

  const data = $derived(opts.data);

  const properties = useDataProperties({ data: getter(() => data) });
  const title = properties.property('title', { validator: notBlank() });
  const description = properties.property('description');

  // let file = $state<File>();
  //   let onFiles = (files: File[]) => {
  //     file = files[0];
  //   };
  // await updateIndexFile({ file });

  const isDirty = $derived(properties.isDirty);

  const save = async () => {
    if (properties.touch()) {
      const dirty = properties.dirty;
      if (dirty) {
        await updateIndex(dirty);
      }
      return data.id;
    }
  };

  const rollback = () => properties.rollback();

  return options(
    {
      title,
      description,
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
