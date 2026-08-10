import { createDatabase } from '#lib/cave/server/database/database';
import { createStorage } from '#lib/cave/server/storage/storage';
import type { Handle } from '@sveltejs/kit';

const db = createDatabase({ filename: '.local/main.db' });
const storage = createStorage({ base: '.local/files' });

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.db = await db;
  event.locals.storage = await storage;
  return await resolve(event);
};
