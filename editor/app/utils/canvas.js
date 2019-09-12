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

export const flipped = (image, horizontal, vertical) => {
  let { width, height } = image;
  if(!image) {
    return;
  }

  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  let ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let h = horizontal ? -1 : 1;
  let v = vertical ? -1 : 1;
  ctx.scale(h, v);

  let x = horizontal ? width * -1 : 0;
  let y = vertical ? height * -1 : 0;
  ctx.drawImage(image, x, y, width, height);

  return canvas;
}
