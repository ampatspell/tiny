import type { Handle } from '@sveltejs/kit';
import { STORAGE_PATH } from '$app/env/private';
import { createServices } from '@ampatspell/cave/server/services';
import { join } from 'node:path';

export const handle: Handle = async ({ event, resolve }) => {
  const { db, files, storage } = await createServices({
    base: STORAGE_PATH,
    migrations: join(import.meta.dirname, 'lib/migrations'),
    schema: join(import.meta.dirname, 'lib'),
  });

  event.locals.db = db;
  event.locals.storage = storage;
  event.locals.files = files;

  return await resolve(event);
};
