// @ts-expect-error Has no better-sqlite3 type
import SQLite from 'better-sqlite3';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely';
import { run } from '../../utils/utils.ts';
import type { Logger } from '../utils.ts';
import { round } from '../../utils/number.ts';

export type CreateDatabaseServicesOptions = {
  file: string;
  wal?: boolean;
  logger?: Logger;
};

export const createDatabaseServices = async <D = unknown>(opts: CreateDatabaseServicesOptions) => {
  const { file: filename, wal = true, logger } = opts;

  const sqlite = await run(async () => {
    if (filename !== ':memory:') {
      await mkdir(dirname(filename), { recursive: true });
    }
    const sqlite = new SQLite(filename);
    if (wal) {
      sqlite.pragma('journal_mode = WAL');
    }
    return sqlite;
  });

  const db = run(() => {
    const dialect = new SqliteDialect({ database: sqlite });

    return new Kysely<D>({
      dialect,
      plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
      log: (event) => {
        const ms = `${round(event.queryDurationMillis)}ms`;
        const sql = event.query.sql;
        if (event.level === 'error') {
          logger?.error('sql', ms, sql, event.error);
        } else {
          logger?.info('sql', ms, sql);
        }
      },
    });
  });

  const as = <D>() => {
    return db as unknown as Kysely<D>;
  };

  return {
    filename,
    sqlite,
    db,
    as,
  };
};

export type DatabaseServices<D = unknown> = Awaited<ReturnType<typeof createDatabaseServices<D>>>;
export type Database<D = unknown> = DatabaseServices<D>['db'];
