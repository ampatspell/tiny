import { uid } from '$lib/server/utils.js';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const withTemporaryFolder = async <T>(cb: (filename: string) => Promise<T>) => {
  const dir = join(tmpdir(), uid());
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
