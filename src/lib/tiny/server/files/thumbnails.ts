import type { Sharp } from 'sharp';

export const jpeg = (opts: { size: number; id?: string; quality?: number }) => {
  const { size, id = `${size}x${size}`, quality = 80 } = opts;

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
    id,
    process,
  };
};
