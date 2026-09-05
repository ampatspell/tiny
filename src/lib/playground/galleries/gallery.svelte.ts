import { addFile, addGallery, deleteGallery, updateGallery, type GalleryDetailsData } from './galleries.remote.ts';
import { notBlank } from '#lib/tiny/properties/validator.svelte.js';
import type { OmitId } from '#lib/tiny/utils/utils.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { slug } from '#lib/tiny/utils/string.js';
import { withDataFields } from '#lib/tiny/fields/data.svelte.js';

export type UseGalleryModelOptions =
  | {
      isNew: true;
      data: OmitId<GalleryDetailsData>;
    }
  | {
      isNew: false;
      data: GalleryDetailsData;
    };

export const useGalleryModel = (_opts: OptionsInput<UseGalleryModelOptions>) => {
  const opts = options(_opts);
  const isNew = $derived(opts.isNew);
  const data = $derived(opts.data);

  const [fields, state] = withDataFields({ data: getter(() => data) }).define(({ string, array }) => {
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

    const files = array('files').define(({ string }) => {
      string('name');
    });

    return {
      name,
      permalink,
      // files,
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

  const addDemoFile = async () => {
    if (!opts.isNew) {
      const id = opts.data.id;
      await addFile({ id });
    }
  };

  return options(
    {
      isNew: getter(() => isNew),
      ...fields,
      ...state.opts,
      save,
      destroy,
      addDemoFile,
    },
    {
      name: 'GalleryModel',
      serialized: ['isNew', 'isDirty'],
    },
  );
};

export type GalleryModel = ReturnType<typeof useGalleryModel>;
