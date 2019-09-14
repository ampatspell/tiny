module.exports = async (runtime, scene) => {

  let file = [
    '#pragma once',
    '#include <avr/pgmspace.h>',
    '',
    `// Scene: "${scene.name}" ${scene.identifier}`,
    '',
    ``
  ];

  await runtime.write(`scene_${scene.identifier}.h`, file.join('\n'));

}
