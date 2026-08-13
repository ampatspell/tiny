import * as v from 'valibot';
import { command, query } from '$app/server';
import { getDatabase, getFiles } from '$lib/server/handle.js';
import { uid } from '$lib/server/utils.js';

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
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  return index;
});

export const updateIndex = command(
  v.strictObject({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    backgroundColor: v.optional(v.string()),
    textColor: v.optional(v.string()),
    indexBackgroundColor: v.optional(v.string()),
    indexTextColor: v.optional(v.string()),
  }),
  async (props) => {
    const db = getDatabase();
    await db.updateTable('index').set(props).execute();

    void getIndex().refresh();
  },
);

export const updateIndexFile = command(
  v.strictObject({
    file: v.file(),
  }),
  async ({ file }) => {
    const db = getDatabase();
    const files = getFiles();

    const index = await db.selectFrom('index').selectAll().executeTakeFirstOrThrow();
    let id = index.backgroundId;

    if (id) {
      await files.drop(id);
    }

    id = uid();
    await Promise.all([db.updateTable('index').set({ backgroundId: id }).execute(), files.store(id, file)]);

    void getIndex().refresh();
  },
);
