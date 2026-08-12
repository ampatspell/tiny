import { join } from 'node:path';
import { connectionStringForStorageRoot, createDatabase } from './database/database.js';
import { createFiles } from './files.js';
import { createStorage } from './storage.js';

export type CreateServicesOptions = {
  base: string;
};

export const createServices = async (opts: CreateServicesOptions) => {
  const { base } = opts;
  const [db, storage] = await Promise.all([
    createDatabase({ connectionString: connectionStringForStorageRoot(base), verbose: true }),
    createStorage({ base: join(base, 'storage') }),
  ]);
  const files = await createFiles({ db, storage });
  return {
    db,
    storage,
    files,
  };
};
