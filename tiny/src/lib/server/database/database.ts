import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import { dirname, join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { round } from '#lib/utils.js';
import type { DB } from './schema.js';

export type CreateDatabaseOptions = {
  connectionString: string;
  verbose?: boolean;
};

export const connectionStringForStorageRoot = (root: string) => join(root, 'tiny.db');

export const createDatabase = async (opts: CreateDatabaseOptions) => {
  const { connectionString, verbose } = opts;
  await mkdir(dirname(connectionString), { recursive: true });

  const dialect = new SqliteDialect({
    database: new SQLite(connectionString),
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
      } else if (verbose) {
        console.error(prefix, ms, sql);
      }
    },
  });

  return db;
};

export type Database = Awaited<ReturnType<typeof createDatabase>>;
