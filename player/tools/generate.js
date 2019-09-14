let config = require('./config');
let runtime = require('./lib');

runtime(config, async ctx => {

  let json = await ctx.cache.retrieve();

  let weirdo = json.world.sprites.find(sprite => sprite.identifier === 'weirdo');
  let frame = weirdo.frames.find(frame => frame.identifier === '0');

  let { size } = weirdo;
  let { bytes } = frame;

  let data = ctx.pixels.toDrawPlusMaskString(bytes, size);

  await ctx.write('sprite.cpp', `
    #include <stdint.h>
    #include <Sprites.h>

    const unsigned char PROGMEM weirdo_plus_mask[] = {
      // size
      ${size.width}, ${size.height},
      // frame
      ${data}
    };

    void drawSprite(uint8_t x, uint8_t y) {
      Sprites::drawPlusMask(x, y, weirdo_plus_mask, 0);
    }

  `);

  await ctx.write('sprite.h', `
    #include <stdint.h>
    void drawSprite(uint8_t x, uint8_t y);
  `);

});
