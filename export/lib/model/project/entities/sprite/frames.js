const Entities = require('../entities');

class Frames extends Entities {

  constructor(sprite, models) {
    super(sprite, sprite.project.sortBy(models, 'json.index', 'asc'));
  }

}

module.exports = Frames;
