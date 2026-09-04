import type { Sharp } from 'sharp';
import type { FileThumbnailOptions } from './files.ts';

export const jpeg = (opts: { size: number; quality?: number }): FileThumbnailOptions => {
  const { size, quality = 80 } = opts;

  const process = async (sharp: Sharp) => {
    const thumbnail = sharp
      .resize({
        width: size,
        height: size,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality });

    const contentType = 'image/jpeg';

    return {
      thumbnail,
      contentType,
    };
  };

  return {
    process,
  };
};
