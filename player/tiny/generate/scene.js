module.exports = async (runtime, scene) => {

  let file = [
    '#pragma once',
    '#include <avr/pgmspace.h>',
    '',
    `// Scene: "${scene.name}" ${scene.identifier}`,
    ''
  ];

  // struct Scene01 {
  //   static uint8_t width = 100;
  // };


  await runtime.write(`scene_${scene.identifier}.h`, file.join('\n'));

}
