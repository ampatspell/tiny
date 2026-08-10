import { getRequestEvent } from '$app/server';
import type { Database } from './database/database';
import type { Storage } from './storage';

export type CreateFilesOptions = {
  db: Database;
  storage: Storage;
};

export const createFiles = async (opts: CreateFilesOptions) => {
  const { db, storage } = opts;

  const store = async (id: string, file: File) => {
    const { type: contentType, name, size } = file;
    const [record] = await Promise.all([
      db.insertInto('files').values({ id, contentType, name, size }).returningAll().execute(),
      storage.file(id).store(file),
    ]);
    console.log('[files] stored', id, name, contentType);
    return record;
  };

  const drop = async (id: string) => {
    await Promise.all([db.deleteFrom('files').where('id', '==', id).execute(), storage.file(id).drop()]);
    console.log('[files] dropped', id);
  };

  return {
    store,
    drop,
  };
};

export type Files = Awaited<ReturnType<typeof createFiles>>;

export const getFiles = () => getRequestEvent().locals.files;
