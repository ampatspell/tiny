import { describe, expect, it } from 'vitest';
import { readTestFileAsFile, withTemporaryFolder } from './helpers/utils.ts';
import { createFilesServices, type Files } from '$lib/next/files/server/files.js';
import { createDatabaseServices, type Database } from '$lib/next/database/server/database.js';
import { createStorageServices, type Storage } from '$lib/next/storage/server/storage.js';
import { join } from 'node:path';
import { jpeg } from '$lib/next/files/server/thumbnails.js';
import type { DB } from '$lib/server/database/schema.js';

const withFiles = async <T>(cb: (opts: { files: Files; db: Database<DB>; storage: Storage }) => Promise<T>) => {
  return await withTemporaryFolder(async (dir) => {
    const { db: db } = await createDatabaseServices({
      file: join(dir, 'test.db'),
      migrations: join(dir, 'migrations'),
    });

    // TODO: needs actual migration files here

    await db.schema
      .createTable('files')
      .addColumn('id', 'text', (col) => col.notNull().primaryKey())
      .addColumn('name', 'text', (col) => col.notNull())
      .execute();

    await db.schema
      .createTable('file_variants')
      .addColumn('id', 'text', (col) => col.notNull().primaryKey())
      .addColumn('file_id', 'text', (col) => col.notNull().references('files.id'))
      .addColumn('variant', 'text', (col) => col.notNull())
      .addColumn('content_type', 'text', (col) => col.notNull())
      .addColumn('size', 'numeric', (col) => col.notNull())
      .addColumn('width', 'numeric')
      .addColumn('height', 'numeric')
      .addUniqueConstraint('file_id_variant_unique', ['file_id', 'variant'])
      .execute();

    await db.schema.createIndex('file_variants_file_id_index').on('file_variants').column('file_id').execute();

    const { storage } = await createStorageServices({ dir: join(dir, 'storage') });
    const { files } = await createFilesServices({ db, storage, thumbnails: [jpeg({ size: 100 })] });
    return await cb({ files, db, storage });
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
