import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
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
    plugins: [new CamelCasePlugin()],
    log: (event) => {
      if (event.level === 'error') {
        console.error('[db]', {
          durationMs: event.queryDurationMillis,
          error: event.error,
          sql: event.query.sql,
          params: event.query.parameters,
        });
      } else {
        console.log('[db]', {
          durationMs: event.queryDurationMillis,
          sql: event.query.sql,
          params: event.query.parameters,
        });
      }
    },
  });

  await migrateToLatest({ db });
  await generateSchema({ filename });

  return db;
};

export type Database = Awaited<ReturnType<typeof createDatabase>>;

export const getDatabase = () => getRequestEvent().locals.db;
