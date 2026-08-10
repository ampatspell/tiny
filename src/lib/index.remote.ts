import * as v from 'valibot';
import { command, query } from '$app/server';
import { getDatabase } from './cave/kysely/database';
import { uid } from './cave/utils';

export const getIndex = query(async () => {
  const db = getDatabase();
  let index = await db.selectFrom('index').selectAll().limit(1).executeTakeFirst();
  if (!index) {
    index = await db.insertInto('index').values({ id: uid(), title: 'maybe' }).returningAll().executeTakeFirstOrThrow();
  }
  return index;
});

export const updateIndex = command(v.strictObject({ title: v.string() }), async ({ title }) => {
  const db = getDatabase();
  await db.updateTable('index').set({ title }).execute();
  void getIndex().refresh();
});
