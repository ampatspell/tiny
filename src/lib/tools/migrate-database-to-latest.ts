import { FileMigrationProvider, Migrator } from 'kysely/migration';
import type { Project } from './project.ts';
import fs from 'node:fs/promises';
import path from 'node:path';
import { log, outro } from '@clack/prompts';

export const migrateDatabaseToLatest = async (project: Project) => {
  await project.database.with(async (db) => {
    const { migrationsRoot: migrationFolder } = project;
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
        log.step(`Migration ${it.migrationName} was executed successfully`);
      } else if (it.status === 'Error') {
        log.step(`Failed to execute migration ${it.migrationName}`);
      }
    });

    if (error) {
      outro(`Failed to migrate to the latest revision: ${error}`);
      process.exit(1);
    } else {
      if (results?.length) {
        outro('Migrated to latest revision');
      } else {
        outro('No new migrations found');
      }
    }
  });
};
