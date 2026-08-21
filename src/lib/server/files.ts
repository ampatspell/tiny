import { error } from '@sveltejs/kit';
import type { Database } from './database/database.js';
import type { Storage } from './storage.js';
import type { DB } from './database/schema.js';
import { images } from '$lib/utils/files.svelte.js';
import sharp from 'sharp';
import { uid } from './utils.ts';

// const { data, info } = await sharp(original)
// .resize({
//   width: definition.width,
//   height: definition.height,
//   fit: definition.fit,
//   withoutEnlargement: true,
// })
// .jpeg({ quality: 80 })
// .toBuffer({ resolveWithObject: true });

export type FileThumbnailOptions = {
  id: string;
};

export type CreateFilesOptions = {
  db: Database<DB>;
  storage: Storage;
  thumbnails: FileThumbnailOptions[];
};

export const createFiles = async (opts: CreateFilesOptions) => {
  const { db, storage } = opts;

  const store = async (id: string, file: File) => {
    const { type, name, size } = file;

    let contentType;
    let width;
    let height;
    if (images.includes(file.type)) {
      const metadata = await sharp(await file.arrayBuffer()).metadata();
      width = metadata.width;
      height = metadata.height;
      contentType = metadata.mediaType ?? type;
    } else {
      contentType = type;
    }

    const [record] = await Promise.all([
      db.insertInto('files').values({ id, contentType, name, size, width, height }).returningAll().execute(),
      storage.file(id).store(file),
    ]);

    console.log('[files] stored', id, name, contentType);
    return record;
  };

  const drop = async (id: string) => {
    await Promise.all([db.deleteFrom('files').where('id', '==', id).execute(), storage.file(id).drop()]);
    console.log('[files] dropped', id);
  };

  const stream = async ({ id: fileId, thumbnail }: { id: string | undefined; thumbnail?: string }) => {
    if (fileId) {
      const [fileRec, thumbnailRec] = await Promise.all([
        db.selectFrom('files').selectAll().where('id', '==', fileId).executeTakeFirst(),
        thumbnail &&
          db
            .selectFrom('fileThumbnails')
            .selectAll()
            .where(({ eb, and }) => and([eb('fileId', '==', fileId), eb('type', '==', thumbnail)]))
            .executeTakeFirst(),
      ]);

      // if (fileRec) {
      //   if (thumbnail) {
      //     if (thumbnailRec) {
      //     } else {
      //       let thumbnailId = uid();
      //       await db
      //         .insertInto('fileThumbnails')
      //         .values({ id: thumbnailId, fileId: fileId, type: thumbnail })
      //         .execute();
      //     }
      //   } else {
      //   }
      // }

      if (fileRec) {
        const stream = storage.file(fileId).toReadableStream();
        return new Response(stream, {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=31536000',
            'Content-Type': fileRec.contentType,
            'Content-Length': String(fileRec.size),
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
