import { join, relative, resolve } from 'node:path';
import { loadPackageJSON } from './utils.ts';
import { exists } from 'fs-extra';
import { log } from '@clack/prompts';
import { connectionStringForStorageRoot, createDatabase, type Database } from '../server/database/database.ts';
import { loadEnvFile } from 'node:process';

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
    loadEnvFile(path);
  }
  const storageRoot = process.env.STORAGE_ROOT;
  if (storageRoot) {
    return {
      storageRoot: resolve(relative(root, storageRoot)),
    };
  }
};

export const createProject = async (opts: { impl: ProjectImpl }) => {
  const { impl } = opts;
  const { root, isTiny, migrationsRoot, schemaRoot } = impl;
  const pkg = await loadPackageJSON(root);
  const env = await loadEnv(root);
  const name = pkg.name as string;
  const storageRoot = env?.storageRoot;

  const connectionString = () => {
    if (!storageRoot) {
      log.error(`STORAGE_ROOT environment variable is required`);
      process.exit(1);
    }
    return connectionStringForStorageRoot(storageRoot);
  };

  const database = {
    connectionString,
    with: async <T>(cb: (database: Database) => Promise<T>) => {
      const db = await createDatabase({ connectionString: connectionString() });
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
    storageRoot,
    schemaRoot,
    database,
  };
};

export type Project = Awaited<ReturnType<typeof createProject>>;
