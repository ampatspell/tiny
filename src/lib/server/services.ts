import { join } from 'node:path';
import { connectionStringForStorageRoot, createDatabase } from './database/database.js';
import { createFiles } from './files.js';
import { createStorage } from './storage.js';
import { createTools } from '$lib/tools/tools.js';

export type CreateServicesOptions = {
  base: string;
};

const _createServices = async (opts: CreateServicesOptions) => {
  const tools = await createTools({ cwd: process.cwd() });
  if (tools) {
    await tools.commands.migrateDatabaseToLatest();
  }

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

type Services = Awaited<ReturnType<typeof _createServices>>;

let promise: Promise<Services>;

export const createServices = async (opts: CreateServicesOptions) => {
  if (!promise) {
    promise = _createServices(opts);
  }
  return promise;
};
