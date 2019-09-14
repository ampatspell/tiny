let config = require('./config');
let runtime = require('./lib');

runtime(config, async ctx => {

  let project = ctx.project(await ctx.cache.retrieve());
  let weirdo = project.spriteByIdentifier('weirdo');
  let wink = weirdo.loopByIdentifier('wink');

  let sprite = weirdo.toPlusMaskString();
  let loop = wink.toFrameIndexesString();

  await ctx.write('sprite.cpp', `
    #include <avr/pgmspace.h>
    #include <generated/sprite.h>
    #include <Sprites.h>

    const unsigned char PROGMEM weirdo_plus_mask[] = {
      ${sprite}
    };

    const uint8_t weirdo_loop_wink[] = { ${loop} };

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
