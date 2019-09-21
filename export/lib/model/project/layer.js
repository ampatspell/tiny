const Node = require('./node');
const Properties = require('./properties');

class Layer {

  constructor(scene, json) {
    Object.defineProperty(this, 'scene', { value: scene });
    let { identifier, type, grid, nodes } = json;
    this.identifier = identifier;
    this.type = type;
    this.grid = grid;
    this.nodes = nodes.map(node => new Node(this, node));
    this.properties = new Properties(json.properties);
  }

}

module.exports = Layer;
