import * as v from 'valibot';
import { command, query } from '$app/server';
import { getDatabase, getFiles } from '../../tiny/server/services/getters.ts';
import { uid } from '#lib/tiny/server/utils.js';
import type { QueryResponse } from '#lib/tiny/utils/utils.js';
import { assertRole } from '#lib/tiny/server/users/request-event.js';
import { omit } from '#lib/tiny/utils/object.js';

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
    const files = getFiles();
    background = await files.data(index.backgroundId);
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
    background: v.optional(v.object({ file: v.optional(v.file()) })),
  }),
  async (input) => {
    await assertRole('admin');

    const db = getDatabase();
    const files = getFiles();

    let backgroundId;
    if (input.background) {
      const file = input.background.file;
      const index = await db.selectFrom('index').select('backgroundId').executeTakeFirstOrThrow();
      backgroundId = await files.replace(index.backgroundId, uid(), file);
    }

    const props = omit(input, ['background']);
    await db
      .updateTable('index')
      .set({ ...props, backgroundId })
      .execute();

    void getIndex().refresh();
  },
);
