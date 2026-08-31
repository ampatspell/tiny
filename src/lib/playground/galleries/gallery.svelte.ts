import { addGallery, deleteGallery, updateGallery, type GalleryData } from './galleries.remote.ts';
import { notBlank } from '#lib/tiny/properties/validator.svelte.js';
import type { OmitId } from '#lib/tiny/utils/utils.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { slug } from '#lib/tiny/utils/string.js';
import { useDataFields } from '#lib/tiny/fields/data.svelte.js';

export type UseGalleryPropertiesOptions =
  | {
      isNew: true;
      data: OmitId<GalleryData>;
    }
  | {
      isNew: false;
      data: GalleryData;
    };

export const useGalleryProperties = (_opts: OptionsInput<UseGalleryPropertiesOptions>) => {
  const opts = options(_opts);
  const isNew = $derived(opts.isNew);
  const data = $derived(opts.data);

  const fields = useDataFields({ data: getter(() => data) });
  const isDirty = $derived(fields.isDirty);

  const name = fields.field.string('name', {
    didUpdate: ({ after }) => {
      permalink.property.update(slug(after, { replacement: '-' }));
    },
    validator: notBlank(),
  });

  const permalink = fields.field.string('permalink', {
    meta: {
      description: 'Part after /gallery in public URL',
    },
  });

  const save = async () => {
    if (fields.touch()) {
      let id;
      if (opts.isNew) {
        const data = fields.data;
        id = await addGallery(data);
      } else {
        const data = fields.dirty;
        if (data) {
          id = opts.data.id;
          await updateGallery({ id, ...data });
        }
      }
      return id;
    }
  };

  const destroy = async () => {
    if (!opts.isNew) {
      const id = opts.data.id;
      await deleteGallery({ id });
    }
  };

  const rollback = () => fields.rollback();

  return options(
    {
      isNew: getter(() => isNew),
      isDirty: getter(() => isDirty),
      name,
      permalink,
      save,
      rollback,
      destroy,
    },
    {
      name: 'GalleryProperties',
      serialized: ['isNew', 'isDirty'],
    },
  );
};

export type GalleryProperties = ReturnType<typeof useGalleryProperties>;
