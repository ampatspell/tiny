const Entities = require('../../entities');

class Nodes extends Entities {

  constructor(layer, models) {
    super(layer, layer.project.sortBy(models, 'json.index', 'desc'));
  }

}

module.exports = Nodes;
