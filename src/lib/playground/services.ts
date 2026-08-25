import type { DB } from '$lib/server/database/schema.js';
import { createServiceGetters } from '$lib/tiny/services/server/handle.js';

const { getDatabase, getFiles, getStorage } = createServiceGetters<DB>();

export { getDatabase, getFiles, getStorage };
