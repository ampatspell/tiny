import * as v from 'valibot';
import { command, query } from '$app/server';
import { getDatabase } from './cave/database/database';
import { run, uid } from './cave/utils';
import { getStorage } from './cave/storage/storage';
import type { File as FileRecord } from './schema';

const store = async (id: string, file: File) => {
  const db = getDatabase();
  const storage = getStorage();
  const record = await db.selectFrom('files').selectAll().where('id', '==', id).executeTakeFirst();

  const meta: Omit<FileRecord, 'id'> = {
    content_type: file.type,
    name: file.name,
    size: file.size,
    hash: uid(),
  };

  await Promise.all([
    run(async () => {
      if (record) {
        await db
          .updateTable('files')
          .where('id', '==', id)
          .set({ ...meta })
          .executeTakeFirstOrThrow();
      } else {
        await db
          .insertInto('files')
          .values({ id, ...meta })
          .execute();
      }
    }),
    storage.file(id).store(file),
  ]);
};

export const getIndex = query(async () => {
  const db = getDatabase();
  const [index, background] = await Promise.all([
    run(async () => {
      let index = await db.selectFrom('index').selectAll().limit(1).executeTakeFirst();
      if (!index) {
        index = await db
          .insertInto('index')
          .values({ id: uid(), title: 'maybe' })
          .returningAll()
          .executeTakeFirstOrThrow();
      }
      return index;
    }),
    run(async () => {
      return db.selectFrom('files').selectAll().where('id', '==', 'index-background').executeTakeFirst();
    }),
  ]);

  return { index, background };
});

export const updateIndex = command(
  v.strictObject({
    title: v.string(),
    file: v.optional(v.file()),
  }),
  async ({ title, file }) => {
    const db = getDatabase();
    await db.updateTable('index').set({ title }).execute();
    if (file) {
      await store('index-background', file);
    }
    void getIndex().refresh();
  },
);
