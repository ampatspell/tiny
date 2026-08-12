import { STORAGE_ROOT } from '$app/env/private';
import { createHandle } from '@ampatspell/tiny/server/handle';

export const handle = createHandle({ storageRoot: STORAGE_ROOT });
