import { format } from 'date-fns';
import dedent from 'dedent';
import launchEditor from 'launch-editor';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Project } from './project.ts';
import { outro } from '@clack/prompts';
import { isTruthy } from '../utils/array.ts';

const template = dedent`
  /* eslint-disable @typescript-eslint/no-explicit-any */
  import { Kysely } from "kysely";

  export const up = async (db: Kysely<any>) => {
  }

  export const down = async (db: Kysely<any>) => {
  }
  `;

export const generateMigrationFile = async (project: Project) => {
  const { isTiny, migrationsRoot } = project;
  const name = [
    format(new Date(), 'yyyy-MM-dd-HH-mm-ss'),
    [isTiny && 'tiny', 'migration.ts'].filter(isTruthy).join('-'),
  ].join('-');
  const path = join(migrationsRoot, name);
  await mkdir(migrationsRoot, { recursive: true });
  await writeFile(path, template, 'utf-8');

  outro(`Migration file ${name} has been created`);

  launchEditor(path);
};
