let config = require('./config');
let runtime = require('./lib');

runtime(config, async ctx => {

  let json = await ctx.cache.retrieve();

  let weirdo = json.world.sprites.find(sprite => sprite.identifier === 'weirdo');

  let { size } = weirdo;
  let data = weirdo.frames.map(frame => {
    let { bytes } = frame;
    return ctx.pixels.toDrawPlusMaskString(bytes, size);
  }).join(', ');

  await ctx.write('sprite.cpp', `
    #include <avr/pgmspace.h>
    #include <generated/sprite.h>
    #include <Sprites.h>

    const unsigned char PROGMEM weirdo_plus_mask[] = {
      // weirdo, ${weirdo.frames.length} frames
      // size
      ${size.width}, ${size.height},
      // frames
      ${data}
    };

    void Weirdo::draw(uint8_t x, uint8_t y, uint8_t frame) {
      Sprites::drawPlusMask(x, y, weirdo_plus_mask, frame);
    }

  `);

  await ctx.write('sprite.h', `
    #include <stdint.h>

    class Weirdo {
    public:
      static void draw(uint8_t x, uint8_t y, uint8_t frame);
    };

  `);

});
