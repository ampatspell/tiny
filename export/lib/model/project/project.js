const Properties = require('./properties');
const { sortBy } = require('../../util/array');
const util = require('util');
const Sprites = require('./entities/sprites');
const Scenes = require('./entities/scenes');
const classify = require("underscore.string/classify");

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

    let models = entities.map(hash => entity(hash));
    Object.defineProperty(this, 'models', { value: models });

    this.sprites = new Sprites(this, models.filter(model => model.type === 'sprite'));
    this.scenes = new Scenes(this, models.filter(model => model.type === 'scene'));

    this.sprites.link();
    this.scenes.link();
  }

  sortBy(array, key, direction) {
    return sortBy(array, key, direction);
  }

  classify(string) {
    return classify(string);
  }

  dir(arg, depth=5) {
    return util.inspect(arg, { colors: true, depth });
  }

  entityById(id) {
    return this.models.find(model => model.id === id);
  }

}

module.exports = Project;
