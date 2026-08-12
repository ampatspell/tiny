import * as v from 'valibot';
import { command, query } from '$app/server';
import { uid } from '@ampatspell/tiny/server/utils';
import { getDatabase, getFiles } from '@ampatspell/tiny/server/handle';

export const getIndex = query(async () => {
  const db = getDatabase();
  // @ts-expect-error db type
  let index = await db.selectFrom('index').selectAll().limit(1).executeTakeFirst();
  if (!index) {
    // @ts-expect-error db type
    index = await db.insertInto('index').values({ id: uid(), title: 'maybe' }).returningAll().executeTakeFirstOrThrow();
  }
  return index;
});

export const updateIndex = command(
  v.strictObject({
    title: v.string(),
  }),
  async ({ title }) => {
    const db = getDatabase();
    // @ts-expect-error db type
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
    const files = getFiles();

    // @ts-expect-error db type
    const index = await db.selectFrom('index').selectAll().executeTakeFirstOrThrow();
    // @ts-expect-error db type
    let id = index.backgroundId;

    if (id) {
      await files.drop(id);
    }

    id = uid();
    // @ts-expect-error db type
    await Promise.all([db.updateTable('index').set({ backgroundId: id }).execute(), files.store(id, file)]);

    void getIndex().refresh();
  },
);
