const Entities = require('../entities');

class Layers extends Entities {

  constructor(scene, models) {
    super(scene, scene.project.sortBy(models, 'json.index', 'desc'));
  }

}

module.exports = Layers;
