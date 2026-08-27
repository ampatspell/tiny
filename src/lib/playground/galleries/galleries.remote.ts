import * as v from 'valibot';
import { command, query } from '$app/server';
import { getDatabase } from '../../tiny/server/services/getters.ts';
import type { QueryResponse } from '$lib/tiny/utils/utils.js';
import { uid } from '$lib/tiny/server/utils.js';
import { omit } from '$lib/tiny/utils/object.js';
import { assertRole } from '$lib/tiny/server/users/request-event.js';

export const getGalleries = query(async () => {
  const db = getDatabase();
  return await db.selectFrom('galleries').selectAll().execute();
});

export const getGalleryById = query(v.strictObject({ id: v.string() }), async ({ id }) => {
  const db = getDatabase();
  return await db.selectFrom('galleries').where('id', '==', id).selectAll().executeTakeFirstOrThrow();
});

export type GalleryData = QueryResponse<typeof getGalleryById>;

export const addGallery = command(
  v.strictObject({
    name: v.optional(v.string()),
    permalink: v.optional(v.string()),
  }),
  async (props) => {
    assertRole('admin');

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
    assertRole('admin');

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
  assertRole('admin');

  await getDatabase().deleteFrom('galleries').where('id', '==', id).execute();
  getGalleries().refresh();
});
