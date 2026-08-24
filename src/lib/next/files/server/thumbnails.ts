import type { Sharp } from 'sharp';

export const jpeg = (size: number, id = `${size}x${size}`) => {
  const process = async (sharp: Sharp) => {
    const thumbnail = sharp
      .resize({
        width: size,
        height: size,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 });

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
