/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable('galleries')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('name', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('permalink', 'text', (col) => col.notNull().defaultTo(''))
    .execute();

  await db.schema
    .createTable('gallery_files')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('gallery_id', 'text', (col) => col.notNull().references('galleries.id'))
    .addColumn('file_id', 'text', (col) => col.notNull().references('files.id'))
    .addColumn('position', 'integer', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull().defaultTo(''))
    .execute();

  await db.schema.createIndex('gallery_files_gallery_id_index').on('gallery_files').column('gallery_id').execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('galleries').execute();
  await db.schema.dropTable('gallery_files').execute();
  await db.schema.dropIndex('gallery_files_gallery_id_index').execute();
};
