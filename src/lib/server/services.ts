import { join } from 'node:path';
import { connectionStringForStorageRoot, createDatabase } from './database/database.js';
import { createFiles, type FileThumbnailOptions } from './files.js';
import { createStorage } from './storage.js';

export type CreateServicesOptions = {
  base: string;
  files: {
    thumbnails: FileThumbnailOptions[];
  };
};

const _createServices = async (opts: CreateServicesOptions) => {
  const {
    base,
    files: { thumbnails },
  } = opts;

  const [db, storage] = await Promise.all([
    createDatabase({ connectionString: connectionStringForStorageRoot(base), verbose: true }),
    createStorage({ base: join(base, 'storage') }),
  ]);

  const files = await createFiles({
    db,
    storage,
    thumbnails,
  });

  return {
    db,
    storage,
    files,
  };
};

type Services = Awaited<ReturnType<typeof _createServices>>;

let promise: Promise<Services>;

export const createServices = async (opts: CreateServicesOptions) => {
  if (!promise) {
    promise = _createServices(opts);
  }
  return promise;
};
