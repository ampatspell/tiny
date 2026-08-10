import { createDatabase } from '#lib/cave/server/database/database';
import { createFiles } from '#lib/cave/server/files';
import { createStorage } from '#lib/cave/server/storage';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const [db, storage] = await Promise.all([
    createDatabase({ filename: '.local/main.db' }),
    createStorage({ base: '.local/files' }),
  ]);
  const files = await createFiles({ db, storage });

  event.locals.db = db;
  event.locals.storage = storage;
  event.locals.files = files;

  return await resolve(event);
};
