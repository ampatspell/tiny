import { FileMigrationProvider, Migrator } from 'kysely/migration';
import path, { resolve } from 'node:path';
import type { Database } from './database';
import fs from 'node:fs/promises';

export type MigrateOptions = {
  db: Database;
};

export const migrateToLatest = async (opts: MigrateOptions) => {
  const { db } = opts;
  const migrationFolder = resolve(import.meta.dirname, 'migrations');

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migration ${it.migrationName} was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`Failed to execute migration ${it.migrationName}`);
    }
  });

  if (error) {
    console.error('Failed to migrate');
    console.error(error);
    process.exit(1);
  }
};
