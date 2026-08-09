import { generate, SqliteDialect } from 'kysely-codegen';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { format } from 'date-fns';
import dedent from 'dedent';
import launchEditor from 'launch-editor';

export type GenerateSchemaOptions = {
  filename: string;
};

export const generateSchema = async (opts: GenerateSchemaOptions) => {
  const { filename: connectionString } = opts;
  const dialect = new SqliteDialect();

  const db = await dialect.introspector.connect({
    connectionString,
    dialect,
  });

  const schema = await generate({
    db,
    dialect,
    runtimeEnums: false,
    singularize: true,
    camelCase: false,
    typeOnlyImports: true,
  });

  const target = join(import.meta.dirname, 'schema.d.ts');

  await writeFile(target, schema, 'utf8');
};

const template = dedent`
  /* eslint-disable @typescript-eslint/no-explicit-any */
  import { Kysely } from "kysely";

  export const up = async (db: Kysely<any>) => {
  }

  export const down = async (db: Kysely<any>) => {
  }
  `;

export const generateMigration = async () => {
  const dir = join(import.meta.dirname, 'migrations');
  const name = [format(new Date(), 'yyyy-MM-dd-HH-mm-ss'), 'migration.ts'].join('-');
  const fullPath = join(dir, name);

  await mkdir(dir, { recursive: true });
  await writeFile(fullPath, template, 'utf-8');

  launchEditor(fullPath);
};
