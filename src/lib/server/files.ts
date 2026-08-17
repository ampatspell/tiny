import { error } from '@sveltejs/kit';
import type { Database } from './database/database.js';
import type { Storage } from './storage.js';
import type { DB } from './database/schema.js';

export type CreateFilesOptions = {
  db: Database<DB>;
  storage: Storage;
};

export const createFiles = async (opts: CreateFilesOptions) => {
  const { db, storage } = opts;

  const store = async (id: string, file: File) => {
    const { type: contentType, name, size } = file;
    const [record] = await Promise.all([
      db.insertInto('files').values({ id, contentType, name, size }).returningAll().execute(),
      storage.file(id).store(file),
    ]);
    console.log('[files] stored', id, name, contentType);
    return record;
  };

  const drop = async (id: string) => {
    await Promise.all([db.deleteFrom('files').where('id', '==', id).execute(), storage.file(id).drop()]);
    console.log('[files] dropped', id);
  };

  const stream = async ({ id }: { id: string | undefined }) => {
    if (id) {
      const record = await db.selectFrom('files').selectAll().where('id', '==', id).executeTakeFirst();
      if (record) {
        const stream = storage.file(id).toReadableStream();
        return new Response(stream, {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=31536000',
            'Content-Type': record.contentType,
            'Content-Length': String(record.size),
          },
        });
      } else {
        throw error(404, 'File not found');
      }
    } else {
      throw error(500, 'Invalid request');
    }
  };

  return {
    store,
    drop,
    stream,
  };
};

export type Files = Awaited<ReturnType<typeof createFiles>>;
