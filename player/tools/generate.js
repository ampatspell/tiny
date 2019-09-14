let config = require('./config');
let runtime = require('./lib');

runtime(config, async ctx => {

  let project = ctx.project(await ctx.cache.retrieve());
  let weirdo = project.spriteByIdentifier('weirdo');
  let wink = weirdo.loopByIdentifier('wink');

  let sprite = weirdo.toPlusMaskString();
  let loop = wink.toFrameIndexesString();

  await ctx.write('weirdo.h', `
    #include <avr/pgmspace.h>

    const unsigned char PROGMEM sprite_weirdo_plus_mask[] = {
      ${sprite}
    };

    const uint8_t sprite_weirdo_loop_wink[] = { ${loop} };

  `);

});
