const Entities = require('./entities');

class Scenes extends Entities {

  constructor(project, models) {
    super(project, project.sortBy(models, 'json.index', 'desc'));
  }

}

module.exports = Scenes;
