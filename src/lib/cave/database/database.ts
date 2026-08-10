import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import { getRequestEvent } from '$app/server';
import { generateSchema } from './codegen';
import { migrateToLatest } from './migration';
import type { DB } from '#lib/schema';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

export type CreateDatabaseOptions = {
  filename: string;
};

export const createDatabase = async (opts: CreateDatabaseOptions) => {
  const { filename } = opts;

  await mkdir(dirname(filename), { recursive: true });

  const dialect = new SqliteDialect({
    database: new SQLite(filename),
  });

  const db = new Kysely<DB>({
    dialect,
    log: ['query', 'error'],
  });

  await migrateToLatest({ db });
  await generateSchema({ filename });

  return db;
};

export type Database = Awaited<ReturnType<typeof createDatabase>>;

export const getDatabase = () => getRequestEvent().locals.db;
