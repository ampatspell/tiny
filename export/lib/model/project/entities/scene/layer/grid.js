const Layer = require('../layer');

class GridLayer extends Layer {

  constructor(project, json) {
    super(project, json);
    this.grid = json.grid;
  }

}

module.exports = GridLayer;
