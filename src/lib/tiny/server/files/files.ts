import type { DB } from '$lib/server/database/schema.js';
import { images, run } from '../../utils/utils.ts';
import { error } from '@sveltejs/kit';
import { jsonArrayFrom } from 'kysely/helpers/sqlite';
import { default as sharp, type Sharp } from 'sharp';
import { uid } from '../utils.ts';
import type { Database } from '../database/database.ts';
import type { Storage } from '../storage/storage.ts';

export type CreateFilesServicesOptions = {
  db: Database<DB>;
  storage: Storage;
  thumbnails?: FileThumbnailOptions[];
};

export type FileThumbnailOptions = {
  id: string;
  process: (original: Sharp) => Promise<{
    thumbnail: Sharp;
    contentType: string;
  }>;
};

export const ORIGINAL = 'original';

export const createFilesServices = async (opts: CreateFilesServicesOptions) => {
  const { db, storage } = opts;

  const files = run(() => {
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

      await Promise.all([
        db.insertInto('files').values({ id: fileId, name }).returningAll().executeTakeFirstOrThrow(),
        db
          .insertInto('fileVariants')
          .values({ id: variantId, fileId: fileId, variant: ORIGINAL, contentType, size, width, height })
          .execute(),
        storage.file(variantId).store(file),
      ]);

      return {
        file: fileId,
        original: variantId,
      };
    };

    const getById = async (id: string) => {
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
      const rec = await getById(id);
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
        const file = await getById(fileId);
        if (file) {
          const variants = file.variants;
          const existing = variants.find((data) => data.variant === variant);
          if (existing) {
            return file;
          } else {
            const originalVariant = variants.find((variant) => variant.variant === ORIGINAL)!;
            if (images.includes(originalVariant.contentType)) {
              const definition = opts.thumbnails?.find((thumbnail) => thumbnail.id === variant);
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

              return (await getById(fileId))!;
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

    const get = async ({ id: fileId, variant: variantId = ORIGINAL }: { id: string | undefined; variant?: string }) => {
      const file = await resolve({ id: fileId, variant: variantId });
      const variant = file.variants.find((rec) => rec.variant === variantId)!; // TODO: resolve should just return variant it created
      const stored = storage.file(variant.id);

      const load = (...args: Parameters<(typeof stored)['load']>) => {
        return stored.load(...args);
      };

      const toReadableStream = (...args: Parameters<(typeof stored)['toReadableStream']>) => {
        return stored.toReadableStream(...args);
      };

      const toResponse = () => {
        const stream = toReadableStream();
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
        file,
        variant,
        load,
        toReadableStream,
        toResponse,
      };
    };

    const data = async (id: string) => {
      const { file } = await get({ id });
      return file;
    };

    return {
      store,
      drop,
      get,
      data,
    };
  });

  return {
    files,
  };
};

export type FilesServices = Awaited<ReturnType<typeof createFilesServices>>;
export type Files = FilesServices['files'];
export type FileData = Awaited<ReturnType<Files['data']>>;
