const Properties = require('./properties');
const { sortBy } = require('../../util/array');
const Sprites = require('./entities/sprites');
const Scenes = require('./entities/scenes');

class Project {

  constructor(json) {
    Object.defineProperty(this, 'json', { value: json });
    let { title, properties, entities } = json;
    this.title = title;
    this.properties = new Properties(this, properties);

    let entity = hash => {
      let { type } = hash;
      let Class = require(`./entities/${type}`);
      return new Class(this, hash);
    };
    let models = sortBy(entities, 'index').map(hash => entity(hash));
    Object.defineProperty(this, 'models', { value: models });

    this.sprites = new Sprites(this, models.filter(model => model.type === 'sprite'));
    this.scenes = new Scenes(this, models.filter(model => model.type === 'scene'));

    this.sprites.link();
    this.scenes.link();
  }

  entityById(id) {
    return this.models.find(model => model.id === id);
  }

}

module.exports = Project;
