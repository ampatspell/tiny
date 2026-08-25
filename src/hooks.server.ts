import { STORAGE_ROOT } from '$app/env/private';
import { jpeg } from '$lib/tiny/files/server/thumbnails.js';
import { createHandle } from '$lib/tiny/services/server/handle.js';
import { join } from 'node:path';

export const handle = createHandle({
  dir: STORAGE_ROOT,
  database: {
    wal: true,
    migrations: join(import.meta.dirname, 'lib/tiny/database/migrations'),
  },
  files: {
    thumbnails: [jpeg({ size: 100 }), jpeg({ size: 1024 }), jpeg({ size: 2048 })],
  },
});
