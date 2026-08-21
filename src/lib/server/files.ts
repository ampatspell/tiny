import { error } from '@sveltejs/kit';
import type { Database } from './database/database.js';
import type { Storage } from './storage.js';
import type { DB, File as FileSchema } from './database/schema.js';
import { images } from '$lib/utils/files.svelte.js';
import sharp, { type Sharp } from 'sharp';
import { uid } from './utils.ts';

export type Meta = {
  id: string;
  contentType: string;
  width: number | undefined;
  height: number | undefined;
  size: number;
};

export type Variants = { [key: string]: Meta };

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

export const ORIGINAL = 'original';

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

    const variants: Variants = {
      [ORIGINAL]: {
        id,
        contentType,
        width,
        height,
        size,
      },
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
    return record;
  };

  const parsed = (rec: FileSchema) => {
    return {
      ...rec,
      variants: rec.variants as unknown as Variants,
    };
  };

  const byId = async (id: string) => {
    const rec = await db.selectFrom('files').selectAll().where('id', '==', id).executeTakeFirst();
    if (rec) {
      return parsed(rec);
    }
  };

  const drop = async (id: string) => {
    const rec = await byId(id);
    if (rec) {
      const variants = rec.variants as unknown as Variants;
      const ids = [id, ...Object.keys(variants).map((key) => variants[key].id)];
      await Promise.all([
        db.deleteFrom('files').where('id', '==', id).execute(),
        ...ids.map((id) => storage.file(id).drop()),
      ]);
    }
  };

  const resolve = async ({ id: fileId, variant = ORIGINAL }: { id: string | undefined; variant?: string }) => {
    if (fileId) {
      const rec = await byId(fileId);
      if (rec) {
        if (variant === ORIGINAL) {
          return rec;
        } else {
          const variants = rec.variants;
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
            return rec;
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
    const stream = storage.file(variant.id).toReadableStream();
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
    byId,
    stream,
  };
};

export type Files = Awaited<ReturnType<typeof createFiles>>;
