import { createReadableStream } from '@sveltejs/kit/node';
import { pathExists } from 'fs-extra';
import { mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Logger } from '../utils.ts';

export type CreateStorageServicesOptions = {
  dir: string;
  logger?: Logger;
};

export const createStorage = async (opts: CreateStorageServicesOptions) => {
  const { dir, logger } = opts;

  await mkdir(dir, { recursive: true });

  const isValidKey = (key: string) => {
    return !key.match(/[^a-zA-Z0-9-]/);
  };

  const getPath = (key: string) => {
    if (!isValidKey(key)) {
      throw new Error(`Invalid file key '${key}'`);
    }
    return resolve(dir, key);
  };

  const file = (key: string) => {
    const path = getPath(key);
    const exists = () => pathExists(path);
    const store = async (body: string | Blob | Buffer) => {
      let bytes;
      if (body instanceof Blob) {
        bytes = await body.bytes();
      } else if (body instanceof Buffer || typeof body === 'string') {
        bytes = body;
      } else {
        throw new Error('Unsupported body');
      }
      await writeFile(path, bytes);
      logger?.info('storage', 'stored', key);
    };
    const drop = async () => {
      await rm(path);
      logger?.info('storage', 'dropped', key);
    };
    const toReadableStream = () => {
      return createReadableStream(path);
    };
    const load = (opts?: Parameters<typeof readFile>[1]) => {
      return readFile(path, opts);
    };
    return {
      key,
      exists,
      store,
      drop,
      toReadableStream,
      load,
    };
  };

  return {
    dir,
    isValidKey,
    file,
  };
};

export type Storage = Awaited<ReturnType<typeof createStorage>>;
