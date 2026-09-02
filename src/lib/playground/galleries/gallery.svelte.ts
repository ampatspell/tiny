import { addGallery, deleteGallery, updateGallery, type GalleryData } from './galleries.remote.ts';
import { notBlank } from '#lib/tiny/properties/validator.svelte.js';
import type { OmitId } from '#lib/tiny/utils/utils.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { slug } from '#lib/tiny/utils/string.js';
import { withDataFields } from '#lib/tiny/fields/data.svelte.js';

export type UseGalleryModelOptions =
  | {
      isNew: true;
      data: OmitId<GalleryData>;
    }
  | {
      isNew: false;
      data: GalleryData;
    };

export const useGalleryModel = (_opts: OptionsInput<UseGalleryModelOptions>) => {
  const opts = options(_opts);
  const isNew = $derived(opts.isNew);
  const data = $derived(opts.data);

  const [fields, state] = withDataFields({ data: getter(() => data) }).define(({ string }) => {
    const name = string('name', {
      didUpdate: ({ after }) => {
        permalink.property.update(slug(after, { replacement: '-' }));
      },
      validator: notBlank(),
    });

    const permalink = string('permalink', {
      meta: {
        description: 'Part after /gallery in public URL',
      },
    });

    return {
      name,
      permalink,
    };
  });

  const save = async () => {
    if (state.touch()) {
      let id;
      if (opts.isNew) {
        const data = state.serialized.all;
        id = await addGallery(data);
      } else {
        const data = state.serialized.dirty;
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

  return options(
    {
      isNew: getter(() => isNew),
      ...fields,
      ...state.opts,
      save,
      destroy,
    },
    {
      name: 'GalleryModel',
      serialized: ['isNew', 'isDirty'],
    },
  );
};

export type GalleryModel = ReturnType<typeof useGalleryModel>;
