module.exports = async (runtime, project) => {

  let generateSpriteFrames = sprite => {
    let frames = sprite.toPlusMaskString();
    return [
      `// Sprite "${sprite.identifier}"`,
      `const unsigned char PROGMEM ${sprite.variable}[] = {`,
      frames,
      '};',
      ''
    ];
  }

  let generateSpriteLoop = (sprite, loop) => {
    let indexes = loop.toFrameIndexesString();
    return [
      `// Sprite "${sprite.identifier}" loop "${loop.identifier}"`,
      `const uint8_t ${loop.variable}[] = { ${indexes} };`,
      ''
    ];
  }

  let generateSpriteLoopClass = (sprite, loop) => {
    return [
      `Loop ${sprite.identifier}_${loop.identifier}(${sprite.identifier}, ${loop.variable}, sizeof(${loop.variable}));`,
      ''
    ];
  }

  let generateSpriteLoops = sprite => {
    let content = [];
    sprite.loops.forEach(loop => {
      loop.variable = `_sprite_${sprite.identifier}_loop_${loop.identifier}_indexes`;
      content.push(
        ...generateSpriteLoop(sprite, loop),
        ...generateSpriteLoopClass(sprite, loop)
      );
    });
    return content;
  }

  let generateSpriteClass = sprite => {
    return [
      `Sprite ${sprite.identifier}(${sprite.variable});`,
      ''
    ];
  }

  let generateSprite = sprite => {
    sprite.variable = `_sprite_${sprite.identifier}_frames_plus_mask`;
    return [
      ...generateSpriteFrames(sprite),
      ...generateSpriteClass(sprite),
      ...generateSpriteLoops(sprite)
    ];
  };

  let generateSprites = () => {
    let content = [];
    project.sprites.forEach(sprite => {
      content.push(...generateSprite(sprite));
    });
    return content;
  }

  let content = [
    ...generateSprites(),
  ];

  let file = [
    '#pragma once',
    '#include <avr/pgmspace.h>',
    '#include <loop.h>',
    '#include <sprite.h>',
    '',
    'namespace Generated {',
    '',
    ...content,
    '',
    '}'
  ];


  await runtime.write('sprites.h', file.join('\n'));

}
