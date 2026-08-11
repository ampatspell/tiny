import type { Handle } from '@sveltejs/kit';
import { STORAGE_ROOT } from '$app/env/private';
import { createServices } from '$lib/server/services.js';

export const handle: Handle = async ({ event, resolve }) => {
  const { db, files, storage } = await createServices({
    base: STORAGE_ROOT,
  });

  event.locals.db = db;
  event.locals.storage = storage;
  event.locals.files = files;

  return await resolve(event);
};
