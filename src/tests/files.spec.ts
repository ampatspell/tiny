import { describe, expect, it } from 'vitest';
import { readTestFileAsFile, withServices } from './helpers/utils.ts';
import type { Files } from '#lib/tiny/server/files/files.js';
import type { Database } from '#lib/tiny/server/database/database.js';
import type { Storage } from '#lib/tiny/server/storage/storage.js';
import type { DB } from '#lib/tiny/server/database/schema.js';

const withFiles = async <T>(cb: (opts: { files: Files; db: Database<DB>; storage: Storage }) => Promise<T>) => {
  return await withServices(async (services) => {
    const db = services.database.db;
    const files = services.files;
    const storage = services.storage;
    await cb({ db, files, storage });
  });
};

describe('files services', () => {
  it('stores an image', async () => {
    await withFiles(async ({ files, storage }) => {
      const file = await readTestFileAsFile('film-0663-032.jpg', 'image/jpeg');
      await files.file('hello').store(file);
      const loaded = await files.file('hello').load();

      expect(await storage.file(loaded!.variants[0].id).exists()).toBeTruthy();
      expect(await storage.file(loaded!.variants[1].id).exists()).toBeTruthy();
      expect(await storage.file(loaded!.variants[2].id).exists()).toBeTruthy();

      expect(loaded).toStrictEqual({
        id: 'hello',
        name: 'film-0663-032.jpg',
        variants: [
          {
            id: loaded!.variants[0].id,
            variant: 'original',
            contentType: 'image/jpeg',
            size: 3508847,
            width: 3484,
            height: 2323,
          },
          {
            id: loaded!.variants[1].id,
            variant: '100x100',
            contentType: 'image/jpeg',
            size: 2482,
            width: 100,
            height: 67,
          },
          {
            id: loaded!.variants[2].id,
            variant: '1024x1024',
            contentType: 'image/jpeg',
            size: 145916,
            width: 1024,
            height: 682,
          },
        ],
      });

      await files.file('hello').drop();

      expect(await files.file('hello').load()).toBeUndefined();

      expect(await storage.file(loaded!.variants[0].id).exists()).toBeFalsy();
      expect(await storage.file(loaded!.variants[1].id).exists()).toBeFalsy();
      expect(await storage.file(loaded!.variants[2].id).exists()).toBeFalsy();
    });
  });
});
