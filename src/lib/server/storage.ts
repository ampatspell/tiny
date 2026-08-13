// TODO: @cush/relative
import resolvePath from 'resolve-path';
import { pathExists, remove } from 'fs-extra';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createReadableStream } from '@sveltejs/kit/node';

export type CreateFilesOptions = {
  base: string;
};

export const createStorage = async (opts: CreateFilesOptions) => {
  const { base } = opts;
  await mkdir(base, { recursive: true });

  const getPaths = (key: string) => {
    if (key.split(/[\\/]/).includes('..')) {
      throw new Error(`Invalid file key ${key}`);
    }
    return resolvePath(base, key);
  };

  const total = async () => {
    // TODO: fast-folder-size replacement
    return 0;
  };

  const file = (key: string) => {
    const path = getPaths(key);
    const exists = () => pathExists(path);
    const store = async (body: string | Blob) => {
      let bytes;
      if (body instanceof Blob) {
        bytes = await body.bytes();
      } else if (typeof body === 'string') {
        bytes = body;
      } else {
        throw new Error('Unsupported body');
      }
      await writeFile(path, bytes);
      console.log('[storage] stored', key);
    };
    const drop = async () => {
      await remove(path);
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
    total,
    file,
  };
};

export type Storage = Awaited<ReturnType<typeof createStorage>>;
