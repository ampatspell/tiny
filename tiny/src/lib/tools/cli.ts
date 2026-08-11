#! /usr/bin/env npx tsx
import { select } from '@clack/prompts';
import { createTools } from './tools.ts';

process.on('SIGINT', () => {
  process.exit(1);
});

const tools = await createTools({ cwd: process.cwd() });

if (tools) {
  const task = await select({
    showInstructions: false,
    message: 'Pick a task',
    options: [
      { value: 'generate-migration', label: 'Create a new migration file' },
      { value: 'generate-schema', label: 'Generate schema.d.ts from database' },
      { value: 'migrate-to-latest', label: 'Migrate database to the latest' },
      { value: 'link-tiny', label: 'Link tiny to this project', disabled: tools.project.isTiny },
    ],
  });

  if (task === 'generate-migration') {
    await tools.commands.generateNewMigrationFile();
  } else if (task === 'generate-schema') {
    await tools.commands.generateSchemaFromDatabase();
  } else if (task === 'migrate-to-latest') {
    await tools.commands.migrateDatabaseToLatest();
  } else if (task === 'link-tiny') {
    await tools.commands.linkTinyToProject();
  }
} else {
  process.exit(1);
}
