import { getDatabase } from '#lib/tiny/server/services/getters.js';
import { query } from '$app/server';

export const getFiles = query(async () => {
  const db = getDatabase();
  const files = await db.selectFrom('files').selectAll().execute();
  return files;
});
