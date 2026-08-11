import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import { generateSchema } from './codegen.js';
import { migrateToLatest } from './migration.js';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { round } from '#lib/utils.js';
import { getRequestEvent } from '$app/server';
import type { DB } from './schema.js';

export type CreateDatabaseOptions = {
  filename: string;
  migrations: string;
  schema: string;
};

export const createDatabase = async (opts: CreateDatabaseOptions) => {
  const { filename, migrations, schema } = opts;

  await mkdir(dirname(filename), { recursive: true });

  const dialect = new SqliteDialect({
    database: new SQLite(filename),
  });

  const db = new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
    log: (event) => {
      const prefix = '[sql]';
      const ms = `${round(event.queryDurationMillis)}ms`;
      const sql = event.query.sql;
      if (event.level === 'error') {
        console.error(prefix, ms, sql, event.error);
      } else {
        console.error(prefix, ms, sql);
      }
    },
  });

  await migrateToLatest({ db, base: migrations });
  await generateSchema({ filename, base: schema });

  return db;
};

export type Database = Awaited<ReturnType<typeof createDatabase>>;

export const getDatabase = (): Database => getRequestEvent().locals.db;
