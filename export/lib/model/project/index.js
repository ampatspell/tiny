const Sprite = require('./sprite');
const World = require('./world');

class Project {

  constructor(json) {
    Object.defineProperty(this, 'json', { value: json });
    let { project: { title }, sprites, world } = json;
    this.title = title;
    this.sprites = sprites.map(sprite => new Sprite(this, sprite));
    this.world = new World(this, world);
  }

  spriteByIdentifier(identifier) {
    return this.sprites.find(sprite => sprite.identifier === identifier);
  }

}

module.exports = Project;
