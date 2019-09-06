import { Promise } from 'rsvp';
import GIF from 'gif';

export default async cb => {
  let gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: '/assets/gif.worker.js'
  });

  await cb(gif);

  return await new Promise(resolve => {
    gif.on('finished', blob => resolve(blob));
    gif.render();
  });
};
