import { join, relative, resolve } from 'node:path';
import { loadPackageJSON } from './utils.ts';
import { exists } from 'fs-extra';
import { log } from '@clack/prompts';
import { loadEnvFile } from 'node:process';
import { createServices, type Services } from '../server/services/services.ts';

type ProjectImpl = {
  isTiny: boolean;
  root: string;
  migrationsRoot: string;
  schemaRoot: string;
};

export const createTinyProjectImpl = async (opts: { root: string }): Promise<ProjectImpl> => {
  const { root } = opts;
  const migrationsRoot = join(root, 'src/lib/tiny/server/database/migrations');
  const schemaRoot = join(root, 'src/lib/tiny/server/database');
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

  const dir = () => {
    const storageRoot = env?.storageRoot;
    if (!storageRoot) {
      log.error(`STORAGE_ROOT environment variable is required`);
      process.exit(1);
    }
    return storageRoot;
  };

  const withServices = async <T>(cb: (services: Services) => Promise<T>) => {
    const wrap = (next: (message: string) => void, omit: boolean) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (first: any, ...args: any[]) => {
        if (omit && first !== 'sql') {
          next([`[${first}]`, ...args].join(' '));
        }
      };
    };
    const services = await createServices({
      dir: dir(),
      logger: {
        info: wrap(log.info, true),
        error: wrap(log.error, false),
      },
      files: {},
      users: {},
    });
    try {
      return await cb(services);
    } finally {
      await services.destroy();
    }
  };

  return {
    root,
    name,
    env,
    isTiny,
    migrationsRoot,
    storageRoot: dir,
    schemaRoot,
    withServices,
  };
};

export type Project = Awaited<ReturnType<typeof createProject>>;
