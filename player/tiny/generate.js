let config = require('./config');
let { run } = require('tiny-export');
let path = require('path');

let local = filename => path.join(__dirname, filename);

run(config, async runtime => {

  let project = await runtime.project();

  project.loops = project.array();
  project.sprites.forEach(sprite => {
    sprite.variable = `Sprite${sprite.classified}`;
    sprite.loops.forEach(loop => {
      loop.variable = `${sprite.variable}Loop${loop.classified}`;
      project.loops.push(loop);
    });
  });

  let backgrounds = {
    'transparent': 0,
    'black': 1,
    'white': 2
  };

  let layerClasses = {
    'grid': 'GridLayer',
    'pixel': 'PixelLayer'
  };

  let nodeClasses = {
    'sprite/loop': 'SpriteLoopNode',
    'sprite/frame': 'SpriteFrameNode',
    'fill': 'FillNode'
  };

  project.scenes.forEach(scene => {
    scene.className = 'Scene';
    scene.namespace = `Scene${scene.classified}`;
    scene.backgroundType = backgrounds[scene.background];
    scene.sizeof = [];
    scene.sizeof.push(`sizeof(${scene.className})`);
    scene.sizeof.push(`(sizeof(Layer*) * ${scene.layers.length})`);
    scene.layers.forEach(layer => {
      layer.className = layerClasses[layer.type];
      layer.variable = `Layer${layer.classified}`;
      scene.sizeof.push(`sizeof(${layer.className})`);
      scene.sizeof.push(`(sizeof(Node*) * ${layer.nodes.length})`);
      layer.nodes.forEach(node => {
        node.className = nodeClasses[node.type];
        node.variable = `${layer.variable}Node${node.classified}`;
        scene.sizeof.push(`sizeof(${node.className})`);
      });
    });
  });

  //

  let render = async ({ template, filename, props }) => {
    filename = filename || template;
    props = props || { project };
    let file = ext => runtime.render(local(`templates/${template}.${ext}.ejs`), props);
    await runtime.write(`${filename}.cpp`, file('cpp')); // setup variables
    await runtime.write(`${filename}.h`, file('h')); // externs
  }

  await Promise.all([
    render({ template: 'sprites' }),
    render({ template: 'scenes' })
  ]);

});
