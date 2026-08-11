import { FileMigrationProvider, Migrator } from 'kysely/migration';
import path from 'node:path';
import type { Database } from './database.js';
import fs from 'node:fs/promises';

export type MigrateOptions = {
  db: Database;
  base: string;
};

export const migrateToLatest = async (opts: MigrateOptions) => {
  const { db, base: migrationFolder } = opts;

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
