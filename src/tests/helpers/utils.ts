import { jpeg } from '$lib/tiny/server/files/thumbnails.js';
import { createServices, type Services } from '$lib/tiny/server/services/services.js';
import { uid } from '$lib/tiny/server/utils.js';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

export const withTemporaryFolder = async <T>(cb: (filename: string) => Promise<T>) => {
  const dir = join(import.meta.dirname, 'tmp', uid());
  await mkdir(dir, { recursive: true });
  try {
    await cb(dir);
  } finally {
    await rm(dir, { recursive: true });
  }
};

export const testFile = (name: string) => join(import.meta.dirname, 'files', name);
export const readTestFileAsBuffer = (name: string) => readFile(testFile(name));
export const readTestFileAsFile = async (name: string, type: string) => {
  return new File([await readTestFileAsBuffer(name)], name, { type });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withServices = async <D = unknown, T = any>(cb: (services: Services<D>) => Promise<T>) => {
  const migrations = join(import.meta.dirname, '../../lib/tiny/server/database/migrations');
  await withTemporaryFolder(async (dir) => {
    const opts = {
      dir,
      database: {
        wal: false,
      },
      files: {
        thumbnails: [jpeg({ size: 100 })],
      },
      users: {
        secret: 'foobar',
      },
    };

    const services = await createServices<D>(opts);

    try {
      await services.database.migrate({ migrations }).toLatest();
      return await cb(services);
    } finally {
      await services.destroy();
    }
  });
};
