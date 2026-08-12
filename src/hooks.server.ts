import { STORAGE_ROOT } from '$app/env/private';
import { createHandle } from '$lib/server/handle.js';

export const handle = createHandle({ storageRoot: STORAGE_ROOT });
