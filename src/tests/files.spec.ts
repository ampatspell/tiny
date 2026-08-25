import { describe, expect, it } from 'vitest';
import { readTestFileAsFile, withServices } from './helpers/utils.ts';
import type { Files } from '$lib/tiny/server/files/files.js';
import type { Database } from '$lib/tiny/server/database/database.js';
import type { Storage } from '$lib/tiny/server/storage/storage.js';
import type { DB } from '$lib/tiny/server/database/schema.js';

const withFiles = async <T>(cb: (opts: { files: Files; db: Database<DB>; storage: Storage }) => Promise<T>) => {
  return await withServices(async (services) => {
    const db = services.database.db;
    const files = services.files;
    const storage = services.storage;
    await cb({ db, files, storage });
  });
};

describe('files services', () => {
  it('stores a file', async () => {
    await withFiles(async ({ files, storage }) => {
      const file = await readTestFileAsFile('film-0663-032.jpg', 'image/jpeg');
      const ret = await files.store('hello', file);
      expect(await storage.file(ret.original).exists()).toStrictEqual(true);
    });
  });

  it('creates a thumbnail and deletes it', async () => {
    await withFiles(async ({ files, storage }) => {
      const file = await readTestFileAsFile('film-0663-032.jpg', 'image/jpeg');
      await files.store('hello', file);

      const hash = await files.get({ id: 'hello', variant: '100x100' });

      expect(hash.file).toStrictEqual({
        id: 'hello',
        name: 'film-0663-032.jpg',
        variants: [
          {
            id: hash.file.variants[0].id,
            variant: 'original',
            contentType: 'image/jpeg',
            size: 3508847,
            width: 3484,
            height: 2323,
          },
          {
            id: hash.file.variants[1].id,
            variant: '100x100',
            contentType: 'image/jpeg',
            size: 2482,
            width: 100,
            height: 67,
          },
        ],
      });

      expect(hash.variant).toStrictEqual({
        id: hash.variant.id,
        variant: '100x100',
        contentType: 'image/jpeg',
        size: 2482,
        width: 100,
        height: 67,
      });

      const original = hash.file.variants.find((v) => v.variant === 'original')!.id;
      const thumbnail = hash.variant.id;

      expect(await storage.file(original).exists()).toStrictEqual(true);
      expect(await storage.file(thumbnail).exists()).toStrictEqual(true);

      await files.drop('hello');

      expect(await storage.file(original).exists()).toStrictEqual(false);
      expect(await storage.file(thumbnail).exists()).toStrictEqual(false);
    });
  });
});
