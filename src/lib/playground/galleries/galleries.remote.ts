import * as v from 'valibot';
import { command, query } from '$app/server';
import { getDatabase } from '../services.ts';
import { uid } from '$lib/server/utils.js';

export const getGalleries = query(async () => {
  const db = getDatabase();
  return await db.selectFrom('galleries').selectAll().execute();
});

export const getGalleryById = query(v.strictObject({ id: v.string() }), async ({ id }) => {
  const db = getDatabase();
  return await db.selectFrom('galleries').where('id', '==', id).selectAll().executeTakeFirstOrThrow();
});

export const addGallery = command(
  v.strictObject({
    name: v.optional(v.string()),
    permalink: v.optional(v.string()),
  }),
  async (props) => {
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
