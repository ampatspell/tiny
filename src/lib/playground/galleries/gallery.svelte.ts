import { addGallery, updateGallery, type GalleryData } from './galleries.remote.ts';
import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import type { OmitId } from '$lib/utils/utils.js';
import { slug } from '$lib/utils/string.js';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';

export type UseGalleryPropertiesOptions = {
  onSaved?: (id: string) => void;
} & (
  | {
      isNew: true;
      data: OmitId<GalleryData>;
    }
  | {
      isNew: false;
      data: GalleryData;
    }
);

export const useGalleryProperties = (_opts: OptionsInput<UseGalleryPropertiesOptions>) => {
  const opts = options(_opts);
  const isNew = $derived(opts.isNew);
  const data = $derived(opts.data);

  const properties = useDataProperties({ data: getter(() => data) });
  const isDirty = $derived(properties.isDirty);

  const name = properties.property('name', {
    didUpdate: ({ after }) => {
      permalink.update(slug(after, { replacement: '-' }));
    },
    validator: notBlank(),
  });
  const permalink = properties.property('permalink', {
    meta: {
      description: 'Part after /gallery in public URL',
    },
  });

  const save = async () => {
    if (properties.touch()) {
      let id;
      if (opts.isNew) {
        const data = properties.data;
        id = await addGallery(data);
      } else {
        const data = properties.dirty;
        if (data) {
          id = opts.data.id;
          await updateGallery({ id, ...data });
        }
      }
      if (id) {
        opts.onSaved?.(id);
      }
    }
  };

  const rollback = () => properties.rollback();

  return options(
    {
      isNew: getter(() => isNew),
      isDirty: getter(() => isDirty),
      name,
      permalink,
      save,
      rollback,
    },
    {
      name: 'GalleryProperties',
      serialized: ['isNew', 'isDirty'],
    },
  );
};

export type GalleryProperties = ReturnType<typeof useGalleryProperties>;
