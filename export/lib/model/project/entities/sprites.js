const Entities = require('./entities');

class Sprites extends Entities {

  constructor(project, models) {
    super(project, project.sortBy(models, 'json.index', 'desc'));
  }

}

module.exports = Sprites;
