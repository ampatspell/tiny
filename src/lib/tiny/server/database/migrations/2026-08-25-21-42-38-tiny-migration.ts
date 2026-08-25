/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable('users')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('salt', 'text')
    .addColumn('hash', 'text')
    .addColumn('type', 'text', (col) => col.notNull())
    .addUniqueConstraint('file_id_variant_unique', ['email'])
    .execute();

  await db.schema.createIndex('users_email_index').on('users').column('email').execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('users').execute();
  await db.schema.dropIndex('users_email_index').execute();
};
