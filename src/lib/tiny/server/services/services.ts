import { join, resolve } from 'node:path';
import { createFilesServices, type FileThumbnailOptions } from '../files/files.ts';
import { createDatabaseServices, type Database } from '../database/database.ts';
import { createStorageServices } from '../storage/storage.ts';
import type { DB } from '../database/schema.js';
import type { Logger } from '../utils.ts';

export type CreateServicesOptions = {
  dir: string;
  logger?: Logger;
  database?: {
    wal?: boolean;
  };
  files?: {
    thumbnails?: FileThumbnailOptions[];
  };
};

export const _createServices = async <D>(opts: CreateServicesOptions) => {
  const { dir, logger } = opts;

  logger?.info('services', 'dir:', resolve(dir));

  const [database, storage] = await Promise.all([
    createDatabaseServices<D>({
      file: join(dir, 'tiny.db'),
      wal: opts.database?.wal,
      logger,
    }),
    createStorageServices({
      dir: join(dir, 'storage'),
      logger,
    }),
  ]);

  const files = await createFilesServices({
    db: database.db as unknown as Database<DB>,
    storage: storage.storage,
    thumbnails: opts.files?.thumbnails,
  });

  return {
    dir,
    database,
    storage,
    files,
  };
};

type CreatedServices<D> = Awaited<ReturnType<typeof _createServices<D>>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let promise: Promise<CreatedServices<any>> | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createServices = async <D = any>(opts: CreateServicesOptions) => {
  if (!promise) {
    promise = _createServices<D>(opts);
  }
  const services: CreatedServices<D> = await promise;
  const destroy = async () => {
    await services.database.db.destroy();
    promise = undefined;
  };
  return {
    ...services,
    destroy,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Services<D = any> = Awaited<ReturnType<typeof createServices<D>>>;
