import { describe, expect, it } from 'vitest';
import { withTemporaryFolder } from './utils.ts';
import { createStorageServices } from '$lib/next/storage/server/storage.js';
import { join } from 'node:path';
import { exists } from 'fs-extra';

describe('storage services', () => {
  it('creates', async () => {
    await withTemporaryFolder(async (root) => {
      const dir = join(root, 'storage');
      const services = await createStorageServices({ dir });
      expect(services.dir).toStrictEqual(dir);
      expect(await exists(dir)).toStrictEqual(true);
    });
  });
  it('expects a valid key', async () => {
    await withTemporaryFolder(async (dir) => {
      const { storage } = await createStorageServices({ dir: join(dir, 'storage') });
      ['.', '!', '/', '$'].forEach((char) => {
        const key = `hello-${char}`;
        expect(() => storage.file(key)).toThrow(`Invalid file key '${key}'`);
      });
      expect(storage.file('hello-123asdQWE')).toBeDefined();
    });
  });
  it('stores a string', async () => {
    await withTemporaryFolder(async (dir) => {
      const { storage } = await createStorageServices({ dir: join(dir, 'storage') });
      await storage.file('hello').store('Thing');
      expect(await storage.file('hello').load('utf-8')).toStrictEqual('Thing');
    });
  });
  it('drops a file', async () => {
    await withTemporaryFolder(async (dir) => {
      const { storage } = await createStorageServices({ dir: join(dir, 'storage') });
      await storage.file('hello').store('Thing');
      await storage.file('hello').drop();
      await expect(storage.file('hello').load('utf-8')).rejects.toThrow();
    });
  });
});
