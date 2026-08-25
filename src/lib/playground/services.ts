import { createServiceGetters } from '$lib/next/services/server/handle.js';
import type { DB } from '$lib/server/database/schema.js';

const { getDatabase, getFiles, getStorage } = createServiceGetters<DB>();

export { getDatabase, getFiles, getStorage };
