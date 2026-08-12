import { createGetters } from '@ampatspell/tiny/server/handle';
import type { DB } from './schema';

const { getDatabase, getFiles, getStorage } = createGetters<DB>();

export { getDatabase, getFiles, getStorage };
