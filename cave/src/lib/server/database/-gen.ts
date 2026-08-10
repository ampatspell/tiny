import { join } from 'node:path';
import { generateMigration } from './codegen.js';

const root = join(import.meta.dirname, 'migrations');
await generateMigration({ root });
