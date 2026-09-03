import { describe, expect, it } from 'vitest';
import { withTemporaryFolder } from './helpers/utils.ts';
import { createStorage } from '#lib/tiny/server/storage/storage.js';
import { join } from 'node:path';
import { exists } from 'fs-extra';

describe('storage services', () => {
  it('creates', async () => {
    await withTemporaryFolder(async (root) => {
      const dir = join(root, 'storage');
      const services = await createStorage({ dir });
      expect(services.dir).toStrictEqual(dir);
      expect(await exists(dir)).toStrictEqual(true);
    });
  });
  it('expects a valid key', async () => {
    await withTemporaryFolder(async (dir) => {
      const storage = await createStorage({ dir: join(dir, 'storage') });
      ['.', '!', '/', '$'].forEach((char) => {
        const key = `hello-${char}`;
        expect(() => storage.file(key)).toThrow(`Invalid file key '${key}'`);
      });
      expect(storage.file('hello-123asdQWE')).toBeDefined();
    });
  });
  it('stores a string', async () => {
    await withTemporaryFolder(async (dir) => {
      const storage = await createStorage({ dir: join(dir, 'storage') });
      await storage.file('hello').store('Thing');
      expect(await storage.file('hello').load.asString()).toStrictEqual('Thing');
    });
  });
  it('drops a file', async () => {
    await withTemporaryFolder(async (dir) => {
      const storage = await createStorage({ dir: join(dir, 'storage') });
      await storage.file('hello').store('Thing');
      await storage.file('hello').drop();
      await expect(storage.file('hello').load.asString()).rejects.toThrow();
    });
  });
});
