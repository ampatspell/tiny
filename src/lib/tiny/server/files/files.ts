import { images, run } from '../../utils/utils.ts';
import { jsonArrayFrom } from 'kysely/helpers/sqlite';
import { default as sharp, type Sharp } from 'sharp';
import { uid } from '../utils.ts';
import type { Database } from '../database/database.ts';
import type { Storage } from '../storage/storage.ts';
import type { DB } from '../database/schema.js';

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

export const createFiles = async (opts: CreateFilesServicesOptions) => {
  const { db, storage, thumbnails } = opts;

  // const get = async ({ id: fileId, variant: variantId = ORIGINAL }: { id: string | undefined; variant?: string }) => {
  //   const { file, variant } = await resolve({ id: fileId, variant: variantId });
  //   const stored = storage.file(variant.id);

  //   const load = (...args: Parameters<(typeof stored)['load']>) => {
  //     return stored.load(...args);
  //   };

  //   const toReadableStream = (...args: Parameters<(typeof stored)['toReadableStream']>) => {
  //     return stored.toReadableStream(...args);
  //   };

  //   const toResponse = () => {
  //     const stream = toReadableStream();
  //     return new Response(stream, {
  //       status: 200,
  //       headers: {
  //         'Cache-Control': 'public, max-age=31536000',
  //         'Content-Type': variant.contentType,
  //         'Content-Length': String(variant.size),
  //       },
  //     });
  //   };

  //   return {
  //     file,
  //     variant,
  //     load,
  //     toReadableStream,
  //     toResponse,
  //   };
  // };

  // const replace = async (previousId: string | null | undefined, nextId: string, file: File | undefined) => {
  //   const [id] = await Promise.all([
  //     run(async () => {
  //       if (file) {
  //         await store(nextId, file);
  //         return nextId;
  //       } else {
  //         return null;
  //       }
  //     }),
  //     run(async () => {
  //       if (previousId) {
  //         await drop(previousId);
  //       }
  //     }),
  //   ]);
  //   return id;
  // };

  const resolveOriginalMetadata = async (opts: { file: File }) => {
    const { file } = opts;
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

    return {
      name,
      size,
      contentType,
      width,
      height,
    };
  };

  type OriginalMetadata = Awaited<ReturnType<typeof resolveOriginalMetadata>>;

  const storeOriginal = async (opts: { id: string; meta: OriginalMetadata; file: File }) => {
    const {
      id,
      meta: { name, contentType, size, width, height },
      file,
    } = opts;

    const variantId = uid();

    await Promise.all([
      db
        .insertInto('files')
        .values({
          id,
          name,
        })
        .execute(),
      db
        .insertInto('fileVariants')
        .values({
          id: variantId,
          fileId: id,
          variant: ORIGINAL,
          contentType,
          size,
          width,
          height,
        })
        .execute(),
      storage.file(variantId).store(file),
    ]);
  };

  const getById = async (opts: { id: string }) => {
    const { id } = opts;
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

  // type FileData = Awaited<ReturnType<typeof getById>>;

  const createVariant = async (opts: { id: string; buffer: Buffer; definition: FileThumbnailOptions }) => {
    const { id: fileId, buffer, definition } = opts;
    const original = sharp(buffer);
    const { thumbnail, contentType } = await definition.process(original);
    const { data, info } = await thumbnail.toBuffer({ resolveWithObject: true });
    const { width, height, size } = info;
    const id = uid();
    const variant = definition.id;
    await Promise.all([
      db
        .insertInto('fileVariants')
        .values({
          id,
          fileId,
          contentType,
          size,
          width,
          height,
          variant,
        })
        .execute(),
      storage.file(id).store(data),
    ]);
  };

  const createVariants = async (opts: { id: string }) => {
    const { id } = opts;
    const data = await getById({ id });
    if (data) {
      const { variants } = data;
      const original = variants.find((variant) => variant.variant === ORIGINAL);
      if (original && images.includes(original.contentType) && thumbnails) {
        const buffer = await storage.file(original.id).load.asBuffer();
        for (const definition of thumbnails) {
          if (!variants.find((variant) => variant.variant === definition.id)) {
            await createVariant({ id, buffer, definition });
          }
        }
      }
    }
  };

  const file = (id: string) => {
    const store = async (file: File) => {
      const meta = await resolveOriginalMetadata({ file });
      await storeOriginal({ id, meta, file });
      await createVariants({ id });
    };

    const load = async () => {
      return await getById({ id });
    };

    const drop = async () => {
      const data = await getById({ id });
      if (data) {
        await Promise.all([
          run(async () => {
            await db.deleteFrom('fileVariants').where('fileId', '==', id).execute();
            await db.deleteFrom('files').where('id', '==', id).execute();
          }),
          run(async () => {
            await Promise.all(
              data.variants.map((variant) => {
                return storage.file(variant.id).drop();
              }),
            );
          }),
        ]);
      }
    };

    return {
      store,
      load,
      drop,
    };
  };

  return {
    file,
  };
};

export type Files = Awaited<ReturnType<typeof createFiles>>;

// export type FileData = Awaited<ReturnType<Files['data']>>;
// export type VariantData = FileData['variants'][number];
