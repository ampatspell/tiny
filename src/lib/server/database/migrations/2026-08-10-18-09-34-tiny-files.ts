/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable('files')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('size', 'integer', (col) => col.notNull())
    .addColumn('content_type', 'text', (col) => col.notNull())
    .addColumn('width', 'integer')
    .addColumn('height', 'integer')
    .execute();
  await db.schema
    .createTable('file_thumbnails')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('width', 'integer')
    .addColumn('height', 'integer')
    .addColumn('file_id', 'text', (col) => col.notNull().references('files.id').onDelete('restrict'))
    .addUniqueConstraint('id_type_unique', ['id', 'type'])
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('files').execute();
  await db.schema.dropTable('file_thumbnails').execute();
};
