import { join } from 'node:path';
import { createDatabase } from './database/database.js';
import { createFiles } from './files.js';
import { createStorage } from './storage.js';

export type CreateServicesOptions = {
  base: string;
  migrations: string;
  schema: string;
};

export const createServices = async (opts: CreateServicesOptions) => {
  const { base, migrations, schema } = opts;
  const [db, storage] = await Promise.all([
    createDatabase({
      filename: join(base, 'main.db'),
      migrations,
      schema,
    }),
    createStorage({ base: join(base, 'storage') }),
  ]);
  const files = await createFiles({ db, storage });
  return {
    db,
    storage,
    files,
  };
};
