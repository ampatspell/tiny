const Sprite = require('./sprite');
const Scene = require('./scene');
const Properties = require('./properties');

class Project {

  constructor(json) {
    Object.defineProperty(this, 'json', { value: json });
    let { title, sprites, scenes } = json;
    this.title = title;
    this.sprites = sprites.map(sprite => new Sprite(this, sprite));
    this.scenes = scenes.map(scene => new Scene(this, scene));
    this.properties = new Properties(json.properties);
  }

  sceneByIdentifier(identifier) {
    return this.scenes.find(scene => scene.identifier === identifier);
  }

  spriteByIdentifier(identifier) {
    return this.sprites.find(sprite => sprite.identifier === identifier);
  }

}

module.exports = Project;
