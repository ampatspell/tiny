import { STORAGE_ROOT } from '$app/env/private';
import { jpeg } from '$lib/server/files.js';
import { createHandle } from '$lib/server/handle.js';

export const handle = createHandle({
  storageRoot: STORAGE_ROOT,
  files: {
    thumbnails: [jpeg(100), jpeg(1024), jpeg(2048)],
  },
});
