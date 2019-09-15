module.exports = async (runtime, scene) => {

  let files = {
    h: [
      '#pragma once',
      '',
      '#include <scene.h>',
      '',
      'namespace Generated {',
      'namespace Scenes {',
      '',
    ],
    cpp: [
      '',
      '#include <layer.h>',
      '#include <scene.h>',
      '#include <node.h>',
      '#include <generated/sprites.h>',
      '',
      'namespace Generated {',
      'namespace Scenes {',
      ''
    ]
  };

  let layers = [];
  scene.layers.forEach((layer, idx) => {
    let layerName = `scene_${scene.identifier}_layer_${idx}`;

    let nodes = [];
    layer.nodes.forEach((node, idx) => {
      let nodeName = `${layerName}_node_${idx}`;
      let { type, sprite } = node;
      let position = `NodePosition(${node.position.x}, ${node.position.y})`;
      let spriteName = `&Generated::Sprites::${sprite.identifier}`;
      if(type === 'sprite/frame') {
        files.cpp.push(...[
          `SpriteFrameNode ${nodeName}(${position}, ${spriteName}, ${node.sprite.frames.indexOf(node.frame)});`,
          ''
        ]);
      } else if(type === 'sprite/loop') {
        files.cpp.push(...[
          `SpriteLoopNode ${nodeName}(${position}, ${spriteName}, ${node.sprite.loops.indexOf(node.loop)});`,
          ''
        ]);
      }
      nodes.push(`(Node *) &${nodeName}`);
    });

    let nodesName = `${layerName}_nodes`;

    files.cpp.push(...[
      `Node *${nodesName}[] = { ${nodes.join(', ') }};`,
      ''
    ]);

    let { type } = layer;
    if(type === 'grid') {
      let { grid } = layer;
      files.cpp.push(...[
        `GridLayer ${layerName}(Grid(${grid.width}, ${grid.height}), ${nodesName}, ${layer.nodes.length});`,
        ''
      ]);
    } else if(type === 'pixel') {
      files.cpp.push(...[
        `PixelLayer ${layerName}(${nodesName}, ${layer.nodes.length});`,
        ''
      ]);
    }
    layers.push(`(Layer *) &${layerName}`);
  });

  files.cpp.push(...[
    `Layer *scene_${scene.identifier}_layers[] = { ${layers.join(', ')} };`,
    ''
  ]);

  let backgrounds = {
    'black': 'Black',
    'white': 'White',
    'transparent': 'Transparent'
  };

  files.cpp.push(...[
    `Scene scene_${scene.identifier}(${backgrounds[scene.background]}, scene_${scene.identifier}_layers, ${scene.layers.length});`,
    ''
  ]);

  files.h.push(...[
    `extern Scene scene_${scene.identifier};`,
    ''
  ]);

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

  let name = `scene_${scene.identifier}`;

  await Promise.all([
    runtime.write(`${name}.h`, files.h.join('\n')),
    runtime.write(`${name}.cpp`, files.cpp.join('\n')),
  ]);

}
