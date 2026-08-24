import { run } from '$lib/utils/utils.js';
import { createReadableStream } from '@sveltejs/kit/node';
import { pathExists } from 'fs-extra';
import { mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export type CreateStorageServicesOptions = {
  dir: string;
};

export const createStorageServices = async (opts: CreateStorageServicesOptions) => {
  const { dir } = opts;

  await mkdir(dir, { recursive: true });

  const storage = run(() => {
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
        console.log('[storage] stored', key);
      };
      const drop = async () => {
        await rm(path);
        console.log('[storage] dropped', key);
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
      isValidKey,
      file,
    };
  });

  return {
    dir,
    storage,
  };
};
