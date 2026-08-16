import { generate, SqliteDialect } from 'kysely-codegen';
import type { Project } from './project.ts';
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { outro } from '@clack/prompts';

export const generateSchemaFromDatabase = async (project: Project) => {
  const connectionString = project.database.connectionString();
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
    camelCase: true,
    typeOnlyImports: true,
  });

  await writeFile(join(project.schemaRoot, 'schema.d.ts'), schema, 'utf8');

  outro('schema.d.ts has been created');
};
