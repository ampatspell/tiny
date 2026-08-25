/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable('galleries')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('name', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('permalink', 'text', (col) => col.notNull().defaultTo(''))
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('galleries').execute();
};
