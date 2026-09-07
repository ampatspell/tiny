import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
import { notBlank } from '#lib/tiny/fields/validator.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { slug } from '#lib/tiny/utils/string.js';
import type { OmitId } from '#lib/tiny/utils/utils.js';
import { addFile, addGallery, deleteGallery, updateGallery, type GalleryDetailsData } from './galleries.remote.ts';

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

  const model = withDataFields({ data: getter(() => data) }).define(({ string }) => {
    const name = string('name', {
      didUpdate: ({ after }) => {
        model.fields.permalink.update(slug(after, { replacement: '-' }));
      },
      validator: notBlank(),
    });

    const permalink = string('permalink', {
      description: 'Part after /gallery in public URL',
    });

    return {
      name,
      permalink,
    };
  });

  const fields = $derived(model.fields);

  const save = async () => {
    if (model.touch()) {
      let id;
      if (opts.isNew) {
        const data = model.serialized.all;
        id = await addGallery(data);
      } else {
        const data = model.serialized.dirty;
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
      fields,
      ...model.state,
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
