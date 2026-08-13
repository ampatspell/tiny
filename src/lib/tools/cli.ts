import { isCancel, outro, select } from '@clack/prompts';
import { createTools } from './tools.ts';
import { parseArgs } from 'node:util';

process.on('SIGINT', () => {
  process.exit(1);
});

const positionals = parseArgs({ allowPositionals: true }).positionals;
const cwd = process.cwd();

const tools = await createTools({ cwd });

const tasks = ['add-migration', 'generate-schema', 'migrate-to-latest', 'link-tiny'] as const;
type Task = symbol | (typeof tasks)[number];

if (tools) {
  let task: Task;
  if (positionals.length === 1) {
    task = positionals[0] as Task;
  } else {
    task = await select({
      showInstructions: false,
      message: 'Pick a task',
      options: [
        { value: 'add-migration', label: 'Add a new migration file' },
        { value: 'migrate-to-latest', label: 'Migrate database to the latest version' },
        { value: 'generate-schema', label: 'Generate schema.d.ts from current database state' },
        { value: 'link-tiny', label: 'Link tiny to this project', disabled: tools.project.isTiny },
      ],
    });
  }
  if (isCancel(task)) {
    outro('Bye');
  } else if (task === 'add-migration') {
    await tools.commands.generateNewMigrationFile();
  } else if (task === 'generate-schema') {
    await tools.commands.generateSchemaFromDatabase();
  } else if (task === 'migrate-to-latest') {
    await tools.commands.migrateDatabaseToLatest();
  } else if (task === 'link-tiny') {
    await tools.commands.linkTinyToProject();
  } else {
    outro(`Unknown command '${String(task)}'. Valid ones are ${tasks.join(', ')}.`);
    process.exit(1);
  }
} else {
  process.exit(1);
}
