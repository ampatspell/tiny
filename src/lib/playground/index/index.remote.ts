import * as v from 'valibot';
import { command, getRequestEvent, query } from '$app/server';
import { getDatabase, getFiles } from '../../tiny/server/services/getters.ts';
import { uid } from '$lib/tiny/server/utils.js';
import type { QueryResponse } from '$lib/tiny/utils/utils.js';
import { assertRole } from '$lib/tiny/server/users/assert.js';

export const getIndex = query(async () => {
  const db = getDatabase();
  let index = await db.selectFrom('index').selectAll().limit(1).executeTakeFirst();
  if (!index) {
    index = await db
      .insertInto('index')
      .values({
        id: uid(),
        title: 'maybe',
        description: '',
        backgroundColor: '#fff',
        textColor: '#000',
        indexBackgroundColor: '#fff',
        indexTextColor: '#000',
        backgroundOffset: 0,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  let background;
  if (index.backgroundId) {
    background = await getFiles().data(index.backgroundId);
  }

  return { ...index, background };
});

export type IndexData = QueryResponse<typeof getIndex>;

export const updateIndex = command(
  v.strictObject({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    backgroundColor: v.optional(v.string()),
    textColor: v.optional(v.string()),
    indexBackgroundColor: v.optional(v.string()),
    indexTextColor: v.optional(v.string()),
    backgroundOffset: v.optional(v.number()),
  }),
  async (props) => {
    assertRole(getRequestEvent(), 'admin');

    const db = getDatabase();
    await db.updateTable('index').set(props).execute();

    void getIndex().refresh();
  },
);

export const updateIndexFile = command(
  v.strictObject({
    file: v.optional(v.file()),
  }),
  async ({ file }) => {
    assertRole(getRequestEvent(), 'admin');

    const db = getDatabase();
    const files = getFiles();

    const index = await db.selectFrom('index').selectAll().executeTakeFirstOrThrow();
    let id = index.backgroundId;

    if (id) {
      await files.drop(id);
    }

    if (file) {
      id = uid();
      await Promise.all([db.updateTable('index').set({ backgroundId: id }).execute(), files.store(id, file)]);
    } else {
      await db.updateTable('index').set({ backgroundId: null }).execute();
    }

    void getIndex().refresh();
  },
);
