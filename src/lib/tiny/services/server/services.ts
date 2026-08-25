import { createDatabaseServices, type Database } from '$lib/tiny/database/server/database.js';
import { createFilesServices, type FileThumbnailOptions } from '$lib/tiny/files/server/files.js';
import { createStorageServices } from '$lib/tiny/storage/server/storage.js';
import type { DB } from '$lib/server/database/schema.js';
import { join } from 'node:path';

export type CreateServicesOptions = {
  dir: string;
  database: {
    wal?: boolean;
    migrations: string;
  };
  files: {
    thumbnails: FileThumbnailOptions[];
  };
};

export const _createServices = async <D = unknown>(opts: CreateServicesOptions) => {
  const dir = opts.dir;

  const [database, storage] = await Promise.all([
    createDatabaseServices<D>({
      file: join(dir, 'tiny.db'),
      migrations: opts.database.migrations,
    }),
    createStorageServices({
      dir: join(dir, 'storage'),
    }),
  ]);

  const files = await createFilesServices({
    db: database.db as unknown as Database<DB>,
    storage: storage.storage,
    thumbnails: opts.files.thumbnails,
  });

  return {
    dir,
    database,
    storage,
    files,
  };
};

export type CreatedServices<D = unknown> = Awaited<ReturnType<typeof _createServices<D>>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let promise: Promise<CreatedServices<any>> | undefined;

export const createServices = async <D = unknown>(opts: CreateServicesOptions) => {
  if (!promise) {
    promise = _createServices<D>(opts);
  }
  const services: CreatedServices<D> = await promise;
  const destroy = () => {
    promise = undefined;
  };
  return {
    ...services,
    destroy,
  };
};

export type Services<D = unknown> = Awaited<ReturnType<typeof createServices<D>>>;
