import { error } from '@sveltejs/kit';
import type { Database } from './database/database.js';
import type { Storage } from './storage.js';
import type { DB } from './database/schema.js';
import { images } from '$lib/utils/files.svelte.js';
import sharp, { type Sharp } from 'sharp';
import { uid } from './utils.ts';
import { jsonArrayFrom } from 'kysely/helpers/sqlite';
import { run } from '$lib/utils/utils.js';

export const jpeg = (size: number, id = `${size}x${size}`) => {
  return {
    id,
    process: async (sharp: Sharp) => {
      const thumbnail = sharp
        .resize({
          width: size,
          height: size,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 });
      return {
        thumbnail,
        contentType: 'image/jpeg',
      };
    },
  };
};

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

    const variantId = uid();

    const [record] = await Promise.all([
      db.insertInto('files').values({ id: fileId, name }).returningAll().executeTakeFirstOrThrow(),
      db
        .insertInto('fileVariants')
        .values({ id: variantId, fileId: fileId, variant: ORIGINAL, contentType, size, width, height })
        .execute(),
      storage.file(variantId).store(file),
    ]);
    return record;
  };

  const byId = async (id: string) => {
    return await db
      .selectFrom('files')
      .select(['id', 'name'])
      .where('id', '==', id)
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('fileVariants')
            .select(['id', 'variant', 'contentType', 'size', 'width', 'height'])
            .whereRef('fileVariants.fileId', '==', 'files.id'),
        ).as('variants'),
      ])
      .executeTakeFirst();
  };

  const drop = async (id: string) => {
    const rec = await byId(id);
    if (rec) {
      await Promise.all([
        run(async () => {
          await db.deleteFrom('fileVariants').where('fileId', '==', id).execute();
          await db.deleteFrom('files').where('id', '==', id).execute();
        }),
        run(async () => {
          await Promise.all(rec.variants.map((variant) => storage.file(variant.id).drop()));
        }),
      ]);
    }
  };

  const resolve = async ({ id: fileId, variant = ORIGINAL }: { id: string | undefined; variant?: string }) => {
    if (fileId) {
      const file = await byId(fileId);
      if (file) {
        const variants = file.variants;
        const existing = variants.find((data) => data.variant === variant);
        if (existing) {
          return file;
        } else {
          const originalVariant = variants.find((variant) => variant.variant === ORIGINAL)!;
          if (images.includes(originalVariant.contentType)) {
            const definition = opts.thumbnails.find((thumbnail) => thumbnail.id === variant);
            if (!definition) {
              throw error(404, 'File variant not found');
            }

            const original = sharp(await storage.file(originalVariant.id).load());
            const { thumbnail, contentType } = await definition.process(original);
            const { data, info } = await thumbnail.toBuffer({ resolveWithObject: true });
            const { width, height, size } = info;

            const id = uid();

            await Promise.all([
              db
                .insertInto('fileVariants')
                .values({
                  id,
                  fileId,
                  variant: definition.id,
                  contentType,
                  size,
                  width,
                  height,
                })
                .returningAll()
                .executeTakeFirstOrThrow(),
              storage.file(id).store(data),
            ]);

            return (await byId(fileId))!;
          } else {
            throw error(404, 'File is not an image');
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
    const variant = rec.variants.find((variant) => variant.variant === variantId)!;
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

export type FileData = NonNullable<Awaited<ReturnType<Files['byId']>>>;
