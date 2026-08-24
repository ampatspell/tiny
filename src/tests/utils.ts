import { uid } from '$lib/server/utils.js';
import { mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const withTemporaryFolder = async <T>(cb: (filename: string) => Promise<T>) => {
  const dir = join(tmpdir(), uid());
  await mkdir(dir, { recursive: true });
  console.log(dir);
  try {
    await cb(dir);
  } finally {
    await rm(dir, { recursive: true });
  }
};
