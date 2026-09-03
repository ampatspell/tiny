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
            identifier: 'original',
            contentType: 'image/jpeg',
            size: 3508847,
            width: 3484,
            height: 2323,
          },
          {
            id: loaded!.variants[1].id,
            identifier: '100x100',
            contentType: 'image/jpeg',
            size: 2482,
            width: 100,
            height: 67,
          },
          {
            id: loaded!.variants[2].id,
            identifier: '1024x1024',
            contentType: 'image/jpeg',
            size: 145916,
            width: 1024,
            height: 682,
          },
        ],
      });

      await files.file('hello').drop();

      await expect(() => files.file('hello').load()).rejects.toThrow();

      expect(await storage.file(loaded!.variants[0].id).exists()).toBeFalsy();
      expect(await storage.file(loaded!.variants[1].id).exists()).toBeFalsy();
      expect(await storage.file(loaded!.variants[2].id).exists()).toBeFalsy();
    });
  });

  it('stores a pdf', async () => {
    await withFiles(async ({ files }) => {
      const file = await readTestFileAsFile('1-page.pdf', 'application/pdf');
      await files.file('hello').store(file);
      const loaded = await files.file('hello').load();
      expect(loaded).toStrictEqual({
        id: 'hello',
        name: '1-page.pdf',
        variants: [
          {
            id: loaded!.variants[0].id,
            identifier: 'original',
            contentType: 'application/pdf',
            size: 3583785,
            width: null,
            height: null,
          },
        ],
      });
    });
  });
});
