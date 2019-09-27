const Layer = require('./layer');
const Properties = require('./properties');

class Scene {

  constructor(project, json) {
    Object.defineProperty(this, 'project', { value: project });
    let { identifier, background, name, size, layers } = json;
    this.identifier = identifier;
    this.background = background;
    this.name = name;
    this.size = size;
    this.layers = layers.map(layer => new Layer(this, layer));
    this.properties = new Properties(json.properties);
  }

  get index() {
    return this.project.scenes.indexOf(this);
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
