import { createDatabase } from '#lib/cave/kysely/database';
import type { Handle } from '@sveltejs/kit';

const db = createDatabase({ filename: 'main.db' });

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.db = await db;
  return await resolve(event);
};
