const Scene = require('./scene');
const Properties = require('./properties');

class World {

  constructor(project, json) {
    Object.defineProperty(this, 'project', { value: project });
    let { name, scenes } = json;
    this.name = name;
    this.scenes = scenes.map(scene => new Scene(this, scene));
    this.properties = new Properties(json.properties);
  }

  sceneByIdentifier(identifier) {
    return this.scenes.find(scene => scene.identifier === identifier);
  }

}

module.exports = World;
