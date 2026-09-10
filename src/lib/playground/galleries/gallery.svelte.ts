import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
import type { InferArrayFieldItem } from '#lib/tiny/fields/models/types.svelte.js';
import { notBlank } from '#lib/tiny/fields/models/validator.svelte.js';
import { useFiles } from '#lib/tiny/files.svelte.js';
import { hasKeys, omit } from '#lib/tiny/utils/object.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { slug } from '#lib/tiny/utils/string.js';
import { images, type OptionalId } from '#lib/tiny/utils/utils.js';
import {
  addFile,
  addGallery,
  deleteFile,
  deleteGallery,
  updateFile,
  updateGallery,
  type GalleryDetailsData,
} from './galleries.remote.ts';

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
          file: files.asUniversal(data.file),
        };
      }),
    };
  });

  const fields = withDataFields({ data: getter(() => data) }).define(({ string, array }) => {
    const name = string('name', {
      label: 'Gallery name',
      didUpdate: ({ after }) => {
        fields.record.permalink.update(slug(after, { replacement: '-' }));
      },
      validator: notBlank(),
    });

    const permalink = string('permalink', {
      description: 'Part after /galleries in public URL',
    });

    let files;
    if (!isNew) {
      files = array('files', ({ file, string, number }) => {
        return {
          name: string('name'),
          position: number('position'),
          file: file('file', { accept: images, variant: '1024x1024', isRequired: true }),
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
    if (fields.touch()) {
      let id;
      if (opts.isNew) {
        const data = fields.serialized.all;
        id = await addGallery(data);
      } else {
        const data = fields.serialized.dirty;
        if (data) {
          id = opts.data.id;
          {
            const props = omit(data, ['files']);
            if (hasKeys(props)) {
              await updateGallery({ id, ...props });
            }
          }
          {
            const files = data.files;
            if (files) {
              for (const entry of files) {
                if (entry.state === 'deleted') {
                  await deleteFile({ id: entry.id });
                } else if (entry.state === 'added') {
                  const { name, position } = entry;
                  const file = entry.file?.file;
                  if (file) {
                    await addFile({ id, file, name: name!, position: position! });
                  }
                } else if (entry.state === 'updated') {
                  const { id, file, name, position } = entry;
                  await updateFile({ id, file, name, position });
                }
              }
            }
          }
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

  const add = async () => {
    const picked = await files.pick.files({ accept: images });
    if (picked.status === 'picked') {
      const files = picked.models;
      const position = 0;
      files.forEach((file, idx) => {
        fields.record.files?.add({
          file,
          name: file.basename,
          galleryId: '',
          fileId: '',
          position: position + idx,
        });
      });
    }
  };

  return fields.asEditable(
    {
      isNew: getter(() => isNew),
      save,
      destroy,
      add,
    },
    {
      name: 'GalleryModel',
      serialized: ['isNew', 'isDirty'],
    },
  );
};

export type GalleryModel = ReturnType<typeof useGalleryModel>;

export type GalleryFileArrayFieldItem = InferArrayFieldItem<GalleryModel['fields']['files']>;
