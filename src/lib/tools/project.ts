import { join, resolve } from 'node:path';
import { loadPackageJSON } from './utils.ts';
import { readFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { exists } from 'fs-extra';
import { log } from '@clack/prompts';
import { connectionStringForStorageRoot, createDatabase, type Database } from '../server/database/database.ts';

type ProjectImpl = {
  isTiny: boolean;
  root: string;
  migrationsRoot: string;
  schemaRoot: string;
};

export const createTinyProjectImpl = async (opts: { root: string }): Promise<ProjectImpl> => {
  const { root } = opts;
  const migrationsRoot = join(root, 'src/lib/server/database/migrations');
  const schemaRoot = join(root, 'src/lib/server/database');
  return {
    isTiny: true,
    root,
    migrationsRoot,
    schemaRoot,
  };
};

export const createConsumerProjectImpl = async (opts: { root: string }): Promise<ProjectImpl> => {
  const { root } = opts;
  const migrationsRoot = join(root, 'src/lib/migrations');
  const schemaRoot = join(root, 'src/lib');
  return {
    isTiny: false,
    root,
    migrationsRoot,
    schemaRoot,
  };
};

const loadEnv = async (root: string) => {
  const path = join(root, '.env');
  if (await exists(path)) {
    const env = parseEnv(await readFile(path, 'utf-8'));
    const storageRoot = env.STORAGE_ROOT;
    if (storageRoot) {
      return {
        storageRoot: resolve(join(root, storageRoot)),
      };
    }
    log.error(`STORAGE_ROOT is required in .env`);
    process.exit(1);
  } else {
    log.error(`.env file is required`);
    process.exit(1);
  }
};

export const createProject = async (opts: { impl: ProjectImpl }) => {
  const { impl } = opts;
  const { root, isTiny, migrationsRoot, schemaRoot } = impl;
  const pkg = await loadPackageJSON(root);
  const env = await loadEnv(root);
  const name = pkg.name as string;

  const connectionString = connectionStringForStorageRoot(env.storageRoot);

  const database = {
    connectionString,
    with: async <T>(cb: (database: Database) => Promise<T>) => {
      const db = await createDatabase({ connectionString });
      try {
        return await cb(db);
      } finally {
        db.destroy();
      }
    },
  };

  return {
    root,
    name,
    env,
    isTiny,
    migrationsRoot,
    schemaRoot,
    database,
  };
};

export type Project = Awaited<ReturnType<typeof createProject>>;
