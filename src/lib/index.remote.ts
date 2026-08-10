import * as v from 'valibot';
import { command, query } from '$app/server';
import { getDatabase } from './cave/server/database/database';
import { getStorage } from './cave/server/storage/storage';
import { uid } from './cave/server/utils';

export const getIndex = query(async () => {
  const db = getDatabase();
  let index = await db.selectFrom('index').selectAll().limit(1).executeTakeFirst();
  if (!index) {
    index = await db.insertInto('index').values({ id: uid(), title: 'maybe' }).returningAll().executeTakeFirstOrThrow();
  }

  let background;
  if (index.background_id) {
    background = await db.selectFrom('files').selectAll().where('id', '==', index.background_id).executeTakeFirst();
  }

  return { index, background };
});

export const updateIndexProperties = command(
  v.strictObject({
    title: v.string(),
  }),
  async ({ title }) => {
    const db = getDatabase();
    await db.updateTable('index').set({ title }).execute();

    void getIndex().refresh();
  },
);

export const updateIndexFile = command(
  v.strictObject({
    file: v.file(),
  }),
  async ({ file }) => {
    const db = getDatabase();
    const storage = getStorage();

    const index = await db.selectFrom('index').selectAll().executeTakeFirstOrThrow();
    let id = index.background_id;

    if (id) {
      await Promise.all([
        db.deleteFrom('files').where('id', '==', index.background_id).execute(),
        storage.file(id).drop(),
      ]);
    }

    id = uid();
    await Promise.all([
      db.updateTable('index').set({ background_id: id }).execute(),
      storage.file(id).store(file),
      db
        .insertInto('files')
        .values({
          id,
          content_type: file.type,
          name: file.name,
          size: file.size,
        })
        .execute(),
    ]);

    void getIndex().refresh();
  },
);
