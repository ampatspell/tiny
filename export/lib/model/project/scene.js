const Layer = require('./layer');
const Properties = require('./properties');

class Scene {

  constructor(world, json) {
    Object.defineProperty(this, 'world', { value: world });
    let { identifier, background, name, size, layers } = json;
    this.identifier = identifier;
    this.background = background;
    this.name = name;
    this.size = size;
    this.layers = layers.map(layer => new Layer(this, layer));
    this.properties = new Properties(json.properties);
  }

  layerByIdentifier(identifier) {
    return this.layers.find(layer => layer.identifier === identifier);
  }

}

module.exports = Scene;
