const Properties = require('./properties');
const { sortBy } = require('../../util/array');
const util = require('util');
const classify = require("underscore.string/classify");
const array = require('./entity/array');

const model = (project, json) => {
  let Class = require(`./entity/${json.type}`);
  return new Class(project, json);
};

const models = (project, array) => array.map(json => model(project, json));

const filtered = (project, type, order) => array(project.sortBy(project.models.filter(model => model.type === type), 'json.index', order));

class Project {

  constructor(json) {
    Object.defineProperty(this, 'json', { value: json });
    Object.defineProperty(this, 'models', { value: models(this, json.entities) });

    this.title = json.title;

    let properties = new Properties(this, json.properties);
    Object.defineProperty(this, 'properties', { value: properties, enumerable: properties.any });

    this.sprites = filtered(this, 'sprite', 'desc');
    this.scenes = filtered(this, 'scene', 'desc');

    this.sprites.map(model => model._bind());
    this.scenes.map(model => model._bind());
  }

  sortBy(array, key, direction) {
    return sortBy(array, key, direction);
  }

  classify(string) {
    return classify(string);
  }

  array(arr) {
    return array(arr || []);
  }

  dir(arg, depth=5) {
    return util.inspect(arg, { colors: true, depth });
  }

  entityById(id) {
    return this.models.find(model => model.id === id);
  }

}

module.exports = Project;
