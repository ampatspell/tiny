import * as v from 'valibot';
import { command, query } from '$app/server';
import { getDatabase } from '@ampatspell/tiny/server/database';
import { getFiles } from '@ampatspell/tiny/server/files';
import { uid } from '@ampatspell/tiny/server/utils';
import type { Kysely } from 'kysely';

export const getIndex = query(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getDatabase() as Kysely<any>;
  let index = await db.selectFrom('index').selectAll().limit(1).executeTakeFirst();
  if (!index) {
    index = await db.insertInto('index').values({ id: uid(), title: 'maybe' }).returningAll().executeTakeFirstOrThrow();
  }
  return index;
});

export const updateIndex = command(
  v.strictObject({
    title: v.string(),
  }),
  async ({ title }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = getDatabase() as Kysely<any>;
    await db.updateTable('index').set({ title }).execute();

    void getIndex().refresh();
  },
);

export const updateIndexFile = command(
  v.strictObject({
    file: v.file(),
  }),
  async ({ file }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = getDatabase() as Kysely<any>;
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
