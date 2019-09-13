let runtime = require('./lib/runtime');
let { retrieve } = require('./lib/cache');

runtime(async () => {

  let json = await retrieve();

  let weirdo = json.world.sprites.find(sprite => sprite.identifier === 'weirdo');
  let frame = weirdo.frames.find(frame => frame.identifier === '0');

  let { size } = weirdo;
  let { bytes } = frame;

  console.log(size, bytes);

});
