module.exports = async (runtime, project) => {

  let file = [
    '#pragma once',
    '#include <avr/pgmspace.h>',
    ''
  ];

  const generateSpriteFrames = sprite => {
    let frames = sprite.toPlusMaskString();
    return [
      `// Sprite "${sprite.identifier}"`,
      `const unsigned char PROGMEM ${sprite.variable}[] = {`,
      frames,
      '};',
      ''
    ];
  }

  const generateSpriteLoops = sprite => {
    return sprite.loops.reduce((arr, loop) => {
      loop.variable = `sprite_${sprite.identifier}_loop_${loop.identifier}_indexes`;
      let indexes = loop.toFrameIndexesString();
      arr.push(...[
        `// Sprite "${sprite.identifier}" loop "${loop.identifier}"`,
        `const uint8_t ${loop.variable}[] = { ${indexes} };`,
        ''
      ]);
      return arr;
    }, []);
  }

  const generateSprite = sprite => {
    let { identifier } = sprite;
    sprite.variable = `sprite_${identifier}_frames_plus_mask`;
    return [
      ...generateSpriteFrames(sprite),
      ...generateSpriteLoops(sprite)
    ]
  }

  file.push(...project.sprites.reduce((arr, sprite) => {
    let content = generateSprite(sprite);
    arr.push(...content);
    return arr;
  }, []));

  await runtime.write('sprites.h', file.join('\n'));

}
