let config = require('./config');
let { run } = require('tiny-export');

run(config, async runtime => {

  let project = await runtime.project();

  let weirdo = project.spriteByIdentifier('weirdo');
  let wink = weirdo.loopByIdentifier('wink');

  let sprite = weirdo.toPlusMaskString();
  let loop = wink.toFrameIndexesString();

  await runtime.write('weirdo.h', `
    #pragma once
    #include <avr/pgmspace.h>

    const unsigned char PROGMEM spriteWeirdoPlusMask[] = {
      ${sprite}
    };

    const uint8_t spriteWeirdoLoopWink[] = { ${loop} };

  `);

});
