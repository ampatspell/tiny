import { assertRole } from '#lib/tiny/server/users/request-event.js';
import { uid } from '#lib/tiny/server/utils.js';
import { hasValues, omit } from '#lib/tiny/utils/object.js';
import type { QueryResponse } from '#lib/tiny/utils/utils.js';
import { command, query } from '$app/server';
import * as v from 'valibot';
import { getDatabase, getFiles } from '../../tiny/server/services/getters.ts';

export const getGalleries = query(async () => {
  const db = getDatabase();
  return await db.selectFrom('galleries').selectAll().execute();
});

export type GalleryData = QueryResponse<typeof getGalleries>[number];

export const getGalleryById = query(v.strictObject({ id: v.string() }), async ({ id }) => {
  const db = getDatabase();
  const gallery = await db.selectFrom('galleries').where('id', '==', id).selectAll().executeTakeFirstOrThrow();
  const galleryFiles = await db.selectFrom('galleryFiles').where('galleryId', '==', id).selectAll().execute();
  const fileIds = galleryFiles.map((file) => file.fileId);
  const files = await getFiles().files(fileIds).load();

  return {
    ...gallery,
    files: galleryFiles.map((base) => {
      return {
        ...base,
        file: files.find((file) => file.id === base.fileId),
      };
    }),
  };
});

export type GalleryDetailsData = QueryResponse<typeof getGalleryById>;

export const addGallery = command(
  v.strictObject({
    name: v.optional(v.string()),
    permalink: v.optional(v.string()),
  }),
  async (props) => {
    await assertRole('admin');

    const { id } = await getDatabase()
      .insertInto('galleries')
      .values({
        id: uid(),
        ...props,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    getGalleries().refresh();

    return id;
  },
);

export const updateGallery = command(
  v.strictObject({
    id: v.string(),
    name: v.optional(v.string()),
    permalink: v.optional(v.string()),
  }),
  async (props) => {
    await assertRole('admin');

    await getDatabase()
      .updateTable('galleries')
      .set(omit(props, ['id']))
      .where('id', '==', props.id)
      .execute();

    getGalleries().refresh();
    getGalleryById({ id: props.id }).refresh();
  },
);

export const deleteGallery = command(v.strictObject({ id: v.string() }), async ({ id }) => {
  await assertRole('admin');

  await getDatabase().deleteFrom('galleries').where('id', '==', id).execute();
  getGalleries().refresh();
});

export const deleteFile = command(v.strictObject({ id: v.string() }), async ({ id }) => {
  await assertRole('admin');

  const db = getDatabase();
  const record = await db.selectFrom('galleryFiles').selectAll().where('id', '==', id).executeTakeFirstOrThrow();

  await db.deleteFrom('galleryFiles').where('id', '==', id).execute();
  await getFiles().file(record.fileId).drop();

  getGalleryById({ id: record.galleryId }).refresh();
});

export const addFile = command(
  v.strictObject({
    id: v.string(),
    file: v.file(),
    name: v.string(),
    position: v.number(),
  }),
  async ({ id: galleryId, file, position, name }) => {
    await assertRole('admin');

    const id = uid();
    const fileId = uid();
    await getFiles().file(fileId).store(file);
    await getDatabase().insertInto('galleryFiles').values({ fileId, galleryId, id, position, name }).execute();

    getGalleryById({ id: galleryId }).refresh();
  },
);

export const updateFile = command(
  v.strictObject({
    id: v.string(),
    file: v.optional(v.strictObject({ file: v.optional(v.file()) })),
    name: v.optional(v.string()),
    position: v.optional(v.number()),
  }),
  async (props) => {
    await assertRole('admin');

    const db = getDatabase();

    const record = await db
      .selectFrom('galleryFiles')
      .selectAll()
      .where('id', '==', props.id)
      .executeTakeFirstOrThrow();

    const update = () => db.updateTable('galleryFiles').where('id', '==', props.id);

    if (props.file?.file) {
      await getFiles().replace({
        prev: record.fileId,
        file: props.file.file,
        update: (fileId) => update().set({ fileId }).execute(),
      });
    }

    const { name, position } = props;
    if (hasValues({ name, position })) {
      await update().set({ name, position }).execute();
    }

    getGalleryById({ id: record.galleryId }).refresh();
  },
);
