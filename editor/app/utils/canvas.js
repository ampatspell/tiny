import { Promise } from 'rsvp';

export const canvasToBlob = (canvas, mimeType='image/png', quality=1) => new Promise(resolve => {
  canvas.toBlob(blob => resolve(blob), mimeType, quality);
});
