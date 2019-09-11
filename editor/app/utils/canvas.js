import { Promise } from 'rsvp';
import { run } from '@ember/runloop';

export const canvasToBlob = (canvas, mimeType='image/png', quality=1) => new Promise(resolve => {
  canvas.toBlob(blob => resolve(blob), mimeType, quality);
});

export const loadImage = (url, crossOrigin) => new Promise((resolve, reject) => {
  if(!url) {
    return resolve();
  }
  let image = new Image(); // eslint-disable-line no-undef
  if(crossOrigin) {
    image.crossOrigin = crossOrigin; // 'anonymous'
  }
  image.addEventListener('load', () => run(() => resolve(image)));
  image.addEventListener('error', err => run(() => reject(new Error(`Image load failed: ${err}`))));
  image.src = url;
});

export const imageURLToBlob = async dataURL => {
  let image = await loadImage(dataURL);
  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.imageSmoothingEnabled = false;
  let ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return await canvasToBlob(canvas);
}
