let runtime = require('./lib/runtime');
let { retrieve } = require('./lib/cache');
let write = require('./lib/write');

runtime(async () => {

  let json = await retrieve();

  let weirdo = json.world.sprites.find(sprite => sprite.identifier === 'weirdo');
  let frame = weirdo.frames.find(frame => frame.identifier === '0');

  let { size } = weirdo;
  let { bytes } = frame;

  let data = `0x00`;

  await write('sprite.h', `
    /*
      Sprite: weirdo
      Frame: 0
      Size: ${size.width}x${size.height}px
    */

    const unsigned char PROGMEM weirdo[] = {
      // size
      ${size.width}, ${size.height},
      // Frame
      ${data}
    };

  `);

});
