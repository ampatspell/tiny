/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable('index')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('index_background_color', 'text', (col) => col.notNull())
    .addColumn('index_text_color', 'text', (col) => col.notNull())
    .addColumn('background_color', 'text', (col) => col.notNull())
    .addColumn('text_color', 'text', (col) => col.notNull())
    .addColumn('background_id', 'text')
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('index').execute();
};
