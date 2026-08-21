import { error } from '@sveltejs/kit';
import type { Database } from './database/database.js';
import type { Storage } from './storage.js';
import type { DB, File as FileSchema } from './database/schema.js';
import { images } from '$lib/utils/files.svelte.js';
import sharp, { type Sharp } from 'sharp';
import { uid } from './utils.ts';

type Meta = {
  id: string;
  contentType: string;
  width: number | undefined;
  height: number | undefined;
  size: number;
};

type Variants = { [key: string]: Meta };

export type FileThumbnailOptions = {
  id: string;
  process: (original: Sharp) => Promise<{
    thumbnail: Sharp;
    contentType: string;
  }>;
};

export type CreateFilesOptions = {
  db: Database<DB>;
  storage: Storage;
  thumbnails: FileThumbnailOptions[];
};

const ORIGINAL = 'original';

export const createFiles = async (opts: CreateFilesOptions) => {
  const { db, storage } = opts;

  const store = async (fileId: string, file: File) => {
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

    const id = uid();

    const variants: Variants = {
      [ORIGINAL]: { id, contentType, width, height, size },
    };

    const [record] = await Promise.all([
      db
        .insertInto('files')
        .values({
          id,
          name,
          variants: JSON.stringify(variants),
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
      storage.file(id).store(file),
    ]);

    console.log('[files] stored', fileId, name, contentType);
    return record;
  };

  const drop = async (id: string) => {
    // TODO: drop thumbnails
    await Promise.all([db.deleteFrom('files').where('id', '==', id).execute(), storage.file(id).drop()]);
    console.log('[files] dropped', id);
  };

  const resolve = async ({ id: fileId, variant = ORIGINAL }: { id: string | undefined; variant?: string }) => {
    if (fileId) {
      const parsed = (rec: FileSchema) => {
        return {
          ...rec,
          variants: JSON.parse(rec.variants) as Variants,
        };
      };
      const rec = await db.selectFrom('files').selectAll().where('id', '==', fileId).executeTakeFirst();
      if (rec) {
        if (variant === ORIGINAL) {
          return parsed(rec);
        } else {
          const variants: Variants = JSON.parse(rec.variants);
          const original = variants[ORIGINAL]!;
          if (images.includes(original.contentType)) {
            const definition = opts.thumbnails.find((thumbnail) => thumbnail.id === variant);
            if (!definition) {
              throw error(404, 'File variant not found');
            }
            const original = sharp(await storage.file(fileId).load());
            const { thumbnail, contentType } = await definition.process(original);
            const { data, info } = await thumbnail.toBuffer({ resolveWithObject: true });
            const { width, height, size } = info;
            const id = uid();
            variants[definition.id] = {
              id,
              contentType,
              size,
              width,
              height,
            };
            const [rec] = await Promise.all([
              db
                .updateTable('files')
                .returningAll()
                .where('id', '==', fileId)
                .set({ variants: JSON.stringify(variants) })
                .executeTakeFirstOrThrow(),
              storage.file(id).store(data),
            ]);
            return parsed(rec);
          } else {
            return parsed(rec);
          }
        }
      } else {
        throw error(404, 'File not found');
      }
    } else {
      throw error(500, 'Invalid request');
    }
  };

  const stream = async ({ id, variant: variantId = ORIGINAL }: { id: string | undefined; variant?: string }) => {
    const rec = await resolve({ id, variant: variantId });
    const variant = rec.variants[variantId]!;
    const stream = storage.file(rec.id).toReadableStream();
    return new Response(stream, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Content-Type': variant.contentType,
        'Content-Length': String(variant.size),
      },
    });
  };

  return {
    store,
    drop,
    stream,
    resolve,
  };
};

export type Files = Awaited<ReturnType<typeof createFiles>>;
