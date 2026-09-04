import { join, resolve } from 'node:path';
import { createFiles, type CreateFilesServicesOptions } from '../files/files.ts';
import { createDatabaseServices, type CreateDatabaseServicesOptions } from '../database/database.ts';
import { createStorage } from '../storage/storage.ts';
import type { DB } from '../database/schema.js';
import type { Logger } from '../utils.ts';
import { createUsers, type CreateUsersOptions } from '../users/users.ts';

export type CreateServicesOptions = {
  dir: string;
  logger?: Logger;
  database?: Pick<CreateDatabaseServicesOptions, 'wal'>;
  files: Pick<CreateFilesServicesOptions, 'thumbnails'>;
  users: Pick<CreateUsersOptions, 'secret' | 'roles'>;
};

export const _createServices = async <D>(opts: CreateServicesOptions) => {
  const { dir, logger } = opts;

  logger?.info('services', 'dir:', resolve(dir));

  const [database, storage] = await Promise.all([
    createDatabaseServices<D>({
      file: join(dir, 'tiny.db'),
      ...opts.database,
      logger,
    }),
    createStorage({
      dir: join(dir, 'storage'),
      logger,
    }),
  ]);

  const db = database.as<DB>();

  const [files, users] = await Promise.all([
    createFiles({
      db,
      storage,
      ...opts.files,
    }),
    createUsers({
      db,
      ...opts.users,
    }),
  ]);

  return {
    dir,
    database,
    storage,
    files,
    users,
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
