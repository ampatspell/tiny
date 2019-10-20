const Layer = require('../layer');

class GridLayer extends Layer {

  bind() {
    super.bind();
    this.grid = this.json.grid;
  }

}

module.exports = GridLayer;
