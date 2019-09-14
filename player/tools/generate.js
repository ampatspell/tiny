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

    const unsigned char PROGMEM spriteWeirdoPlusMask[] = {
      ${sprite}
    };

    const uint8_t spriteWeirdoLoopWink[] = { ${loop} };

  `);

});
