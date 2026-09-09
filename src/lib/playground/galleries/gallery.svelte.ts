import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
import { notBlank } from '#lib/tiny/fields/models/validator.svelte.js';
import { useFiles } from '#lib/tiny/files.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { slug } from '#lib/tiny/utils/string.js';
import type { OptionalId } from '#lib/tiny/utils/utils.js';
import { addGallery, deleteGallery, updateGallery, type GalleryDetailsData } from './galleries.remote.ts';

export type UseGalleryModelOptions =
  | {
      isNew: true;
      data: OptionalId<GalleryDetailsData>;
    }
  | {
      isNew: false;
      data: GalleryDetailsData;
    };

export const useGalleryModel = (_opts: OptionsInput<UseGalleryModelOptions>) => {
  const opts = options(_opts);
  const isNew = $derived(opts.isNew);
  const files = useFiles();
  const data = $derived.by(() => {
    const data = opts.data;
    return {
      ...data,
      files: data.files.map((data) => {
        return {
          ...data,
          file: files.asRemote(data.file),
        };
      }),
    };
  });

  const model = withDataFields({ data: getter(() => data) }).define(({ string, array }) => {
    const name = string('name', {
      didUpdate: ({ after }) => {
        model.record.permalink.update(slug(after, { replacement: '-' }));
      },
      validator: notBlank(),
    });

    const permalink = string('permalink', {
      description: 'Part after /gallery in public URL',
    });

    let files;
    if (!isNew) {
      files = array('files', ({ file, string, number }) => {
        return {
          name: string('name'),
          position: number('position'),
          file: file('file'),
        };
      });
    }

    return {
      name,
      permalink,
      files,
    };
  });

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

  return model.asEditable(
    {
      isNew: getter(() => isNew),
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
