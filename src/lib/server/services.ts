import { join } from 'node:path';
import { connectionStringForStorageRoot, createDatabase } from './database/database.js';
import { createFiles } from './files.js';
import { createStorage } from './storage.js';
import type { Sharp } from 'sharp';

export type CreateServicesOptions = {
  base: string;
};

const jpeg = (size: number) => {
  return {
    id: `${size}x${size}`,
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

const _createServices = async (opts: CreateServicesOptions) => {
  const { base } = opts;

  const [db, storage] = await Promise.all([
    createDatabase({ connectionString: connectionStringForStorageRoot(base), verbose: true }),
    createStorage({ base: join(base, 'storage') }),
  ]);

  const files = await createFiles({
    db,
    storage,
    thumbnails: [jpeg(100), jpeg(1024), jpeg(2048)],
  });

  return {
    db,
    storage,
    files,
  };
};

type Services = Awaited<ReturnType<typeof _createServices>>;

let promise: Promise<Services>;

export const createServices = async (opts: CreateServicesOptions) => {
  if (!promise) {
    promise = _createServices(opts);
  }
  return promise;
};
