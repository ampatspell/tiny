import { images, run } from '../../utils/utils.ts';
import { jsonArrayFrom } from 'kysely/helpers/sqlite';
import { default as sharp, type Sharp } from 'sharp';
import { uid } from '../utils.ts';
import type { Database } from '../database/database.ts';
import type { Storage, StorageFile } from '../storage/storage.ts';
import type { DB } from '../database/schema.js';
import { error } from '@sveltejs/kit';

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
      const loaded = await getById({ id });
      if (loaded) {
        return loaded;
      }
      error(404, 'File not found');
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

    const variant = (variantId?: string) => {
      variantId ??= ORIGINAL;

      const loadVariant = async () => {
        const file = await load();
        const variant = file.variants.find((variant) => variant.variant === variantId);
        if (variant) {
          return { file, variant };
        } else {
          error(404, 'Variant not found');
        }
      };

      type Loaded = NonNullable<Awaited<ReturnType<typeof loadVariant>>>;

      const withLoaded = async <T>(cb: (opts: { data: Loaded; variant: StorageFile }) => T) => {
        const data = await loadVariant();
        const variant = storage.file(data.variant.id);
        return cb({ data, variant });
      };

      const asBuffer = () => withLoaded(({ variant }) => variant.load.asBuffer());
      const asString = () => withLoaded(({ variant }) => variant.load.asString());
      const asReadableStream = () => withLoaded(({ variant }) => variant.toReadableStream());
      const asResponse = async () => {
        return await withLoaded(({ data, variant }) => {
          const stream = variant.toReadableStream();
          return new Response(stream, {
            status: 200,
            headers: {
              'Cache-Control': 'public, max-age=31536000',
              'Content-Type': data.variant.contentType,
              'Content-Length': String(data.variant.size),
            },
          });
        });
      };

      return {
        asBuffer,
        asString,
        asReadableStream,
        asResponse,
      };
    };

    return {
      store,
      load,
      drop,
      variant,
    };
  };

  const replace = async ({
    prev,
    next,
    file: nextFile,
  }: {
    prev: string | null | undefined;
    next: string;
    file: File | undefined;
  }) => {
    const [id] = await Promise.all([
      run(async () => {
        if (nextFile) {
          await file(next).store(nextFile);
          return next;
        } else {
          return null;
        }
      }),
      run(async () => {
        if (prev) {
          await file(prev).drop();
        }
      }),
    ]);
    return id;
  };

  const handle = async ({ id, variant }: { id: string | undefined; variant: string | undefined }) => {
    if (id && variant) {
      return await file(id).variant(variant).asResponse();
    } else {
      error(422, 'Insufficient parameters');
    }
  };

  return {
    file,
    replace,
    handle,
  };
};

export type Files = Awaited<ReturnType<typeof createFiles>>;
export type FileData = NonNullable<Awaited<ReturnType<ReturnType<Files['file']>['load']>>>;
export type VariantData = FileData['variants'][number];
