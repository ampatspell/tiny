/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable('index')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('title', 'text', (col) => col.notNull())
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('index').execute();
};
