module.exports = async (runtime, project) => {

  let files = {
    h: [
      '#pragma once',
      '',
      '#include <sprite.h>',
      '',
      'namespace Generated {',
      'namespace Sprites {',
      '',
    ],
    cpp: [
      '#include <avr/pgmspace.h>',
      '#include <sprites.h>',
      '#include <frames.h>',
      '#include <loop.h>',
      '#include <sprite.h>',
      '',
      'namespace Generated {',
      'namespace Sprites {',
      ''
    ]
  };

  project.sprites.forEach(sprite => {
    sprite.variable = `_sprite_${sprite.identifier}_frames_plus_mask`;

    //

    let frames = sprite.toPlusMaskString();
    files.cpp.push(...[
      `// Sprite "${sprite.identifier}"`,
      `const unsigned char ${sprite.variable}[] PROGMEM = {`,
      frames,
      '};',
      ''
    ]);

    //

    files.cpp.push(...[
      `Frames ${sprite.identifier}_frames(${sprite.variable});`,
      ''
    ]);

    //

    let loops = [];

    sprite.loops.forEach(loop => {
      loop.indexesVariable = `_sprite_${sprite.identifier}_loop_${loop.identifier}_indexes`;
      loop.variable = `${sprite.identifier}_${loop.identifier}`;

      let indexes = loop.toFrameIndexesString();

      //

      files.cpp.push(...[
        `// Sprite "${sprite.identifier}" loop "${loop.identifier}"`,
        `const uint8_t ${loop.indexesVariable}[] = { ${indexes} };`,
        ''
      ]);

      //

      files.cpp.push(...[
        `Loop ${sprite.identifier}_${loop.identifier}(&${sprite.identifier}_frames, ${loop.indexesVariable}, sizeof(${loop.indexesVariable}));`,
        ''
      ]);

      loops.push(`&${loop.variable}`);
    });

    files.cpp.push(...[
      `Loop *${sprite.identifier}_loops = { ${loops.join(', ')} };`,
      '',
      `Sprite ${sprite.identifier}(&${sprite.identifier}_frames, ${sprite.identifier}_loops);`,
      ''
    ]);
    files.h.push(...[
      `extern Sprite ${sprite.identifier};`
    ]);
  });

  files.h.push(...[
    '',
    '}',
    '}',
    ''
  ]);

  files.cpp.push(...[
    '',
    '}',
    '}',
    ''
  ]);

  await Promise.all([
    runtime.write('sprites.h', files.h.join('\n')),
    runtime.write('sprites.cpp', files.cpp.join('\n'))
  ]);

}
