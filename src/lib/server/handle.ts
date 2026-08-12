import { getRequestEvent } from '$app/server';
import type { Handle } from '@sveltejs/kit';
import { createServices } from './services.ts';
import type { Files } from './files.ts';
import type { Storage } from './storage.ts';
import type { Database } from './database/database.ts';
import type { DB } from './database/schema.js';

export const createHandle = ({ storageRoot }: { storageRoot: string }): Handle => {
  return async ({ event, resolve }) => {
    const { db, files, storage } = await createServices({
      base: storageRoot,
    });

    event.locals.tiny = { db, files, storage };

    return await resolve(event);
  };
};

const getLocal = () => getRequestEvent().locals.tiny;

export const createGetters = <D extends DB>() => {
  const getDatabase = () => getLocal().db as unknown as Database<D>;
  const getStorage = () => getLocal().storage as Storage;
  const getFiles = () => getLocal().files as Files;
  return {
    getDatabase,
    getStorage,
    getFiles,
  };
};

const { getDatabase, getFiles, getStorage } = createGetters<DB>();

export { getDatabase, getFiles, getStorage };
