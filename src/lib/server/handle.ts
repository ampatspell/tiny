import { getRequestEvent } from '$app/server';
import type { Handle } from '@sveltejs/kit';
import { createServices } from './services.ts';
import type { Files, FileThumbnailOptions } from './files.ts';
import type { Storage } from './storage.ts';
import type { Database } from './database/database.ts';

export const createHandle = (opts: {
  storageRoot: string | undefined;
  files: {
    thumbnails: FileThumbnailOptions[];
  };
}): Handle => {
  return async ({ event, resolve }) => {
    const { db, files, storage } = await createServices({
      base: opts.storageRoot ?? '.local',
      files: opts.files,
    });

    event.locals.tiny = { db, files, storage };

    return await resolve(event);
  };
};

const getLocal = () => getRequestEvent().locals.tiny;

export const createServiceGetters = <D>() => {
  const getDatabase = () => getLocal().db as unknown as Database<D>;
  const getStorage = () => getLocal().storage as Storage;
  const getFiles = () => getLocal().files as Files;
  return {
    getDatabase,
    getStorage,
    getFiles,
  };
};
