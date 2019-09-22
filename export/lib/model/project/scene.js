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

  get index() {
    return this.world.scenes.indexOf(this);
  }

  layerByIdentifier(identifier) {
    return this.layers.find(layer => layer.identifier === identifier);
  }

  get nodes() {
    let nodes = this._nodes;
    if(!nodes) {
      nodes = this.layers.reduce((arr, layer) => {
        layer.nodes.reduce((arr, node) => {
          arr.push(node);
          return arr;
        }, arr);
        return arr;
      }, []);
      Object.defineProperty(this, '_nodes', { value: nodes });
    }
    return nodes;
  }

}

module.exports = Scene;
