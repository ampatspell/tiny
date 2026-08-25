import { STORAGE_ROOT } from '$app/env/private';
import { jpeg } from '$lib/tiny/server/files/thumbnails.js';
import { createHandle } from '$lib/tiny/server/services/handle.js';
import { createBasicLogger } from '$lib/tiny/server/utils.js';

export const handle = createHandle({
  dir: STORAGE_ROOT,
  files: {
    thumbnails: [jpeg({ size: 100 }), jpeg({ size: 1024 }), jpeg({ size: 2048 })],
  },
  logger: createBasicLogger(),
});
