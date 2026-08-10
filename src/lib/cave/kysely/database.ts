import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import { getRequestEvent } from '$app/server';
import { generateSchema } from './codegen';
import type { DB } from './schema';
import { migrateToLatest } from './migration';

export type CreateDatabaseOptions = {
  filename: string;
};

export const createDatabase = (opts: CreateDatabaseOptions) => {
  const { filename } = opts;

  const dialect = new SqliteDialect({
    database: new SQLite(filename),
  });

  const db = new Kysely<DB>({
    dialect,
    log: ['query', 'error'],
  });

  const prepare = async () => {
    await migrateToLatest({ db });
    await generateSchema({ filename });
    return db;
  };

  return prepare();
};

export type Database = ReturnType<typeof createDatabase> extends Promise<infer T> ? T : never;

export const getDatabase = () => getRequestEvent().locals.db;
