import { createServices, type CreateServicesOptions } from './services.ts';
import { getRequestEvent } from '$app/server';
import type { Database } from '../database/database.ts';
import type { Files } from '../files/files.ts';
import type { Storage } from '../storage/storage.ts';
import type { Users } from '../users/users.ts';
import type { Handle } from '@sveltejs/kit/hooks';

export const createHandle = (opts: Omit<CreateServicesOptions, 'dir'> & { dir: string | undefined }): Handle => {
  return async ({ event, resolve }) => {
    const { dir } = opts;
    const services = await createServices({
      ...opts,
      dir: dir ?? '.local',
    });

    event.locals.tiny = {
      db: services.database.db,
      storage: services.storage,
      files: services.files,
      users: services.users,
    };

    return await resolve(event);
  };
};

const getLocal = () => getRequestEvent().locals.tiny;

export const createServiceGetters = <D>() => {
  const getDatabase = () => getLocal().db as unknown as Database<D>;
  const getStorage = () => getLocal().storage as Storage;
  const getFiles = () => getLocal().files as Files;
  const getUsers = () => getLocal().users as Users;
  return {
    getDatabase,
    getStorage,
    getFiles,
    getUsers,
  };
};
