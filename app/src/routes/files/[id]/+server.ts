import { getDatabase } from '@ampatspell/tiny/server/database';
import { getStorage } from '@ampatspell/tiny/server/storage';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { id } }) => {
  if (id) {
    const record = await getDatabase().selectFrom('files').selectAll().where('id', '==', id).executeTakeFirst();
    if (record) {
      const storage = getStorage();
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
