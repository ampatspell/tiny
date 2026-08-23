/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>) => {
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
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('files').execute();
  await db.schema.dropTable('file_variants').execute();
};
