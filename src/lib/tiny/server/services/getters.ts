import type { DB } from '#lib/tiny/server/database/schema.js';
import { createServiceGetters } from '#lib/tiny/server/services/handle.js';

const { getDatabase, getFiles, getStorage, getUsers } = createServiceGetters<DB>();

export { getDatabase, getFiles, getStorage, getUsers };
