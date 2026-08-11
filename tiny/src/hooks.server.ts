import { createServices } from '#lib/server/services.js';
import type { Handle } from '@sveltejs/kit';
import { join } from 'node:path';

export const handle: Handle = async ({ event, resolve }) => {
  const base = join(import.meta.dirname, 'lib', 'server', 'database');

  const { db, files, storage } = await createServices({
    base: '.local',
    schema: base,
    migrations: join(base, 'migrations'),
  });

  event.locals.db = db;
  event.locals.storage = storage;
  event.locals.files = files;

  return await resolve(event);
};
