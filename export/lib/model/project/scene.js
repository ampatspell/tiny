const Layer = require('./layer');

class Scene {

  constructor(world, json) {
    Object.defineProperty(this, 'world', { value: world });
    let { identifier, background, name, size, layers } = json;
    this.identifier = identifier;
    this.background = background;
    this.name = name;
    this.size = size;
    this.layers = layers.map(layer => new Layer(this, layer));
  }

}

module.exports = Scene;