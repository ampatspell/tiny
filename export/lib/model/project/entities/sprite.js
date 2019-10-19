const Entity = require('./entity');
const Entities = require('./entities');

class Sprite extends Entity {

  constructor(project, json) {
    super(project, json);
    this.size = json.size;
  }

  link() {
    super.link();
    this.frames = new Entities(this, this.models.filter(model => model.type === 'sprite/frame'));
    this.loops = new Entities(this, this.models.filter(model => model.type === 'sprite/loop'));
    this.frames.link();
    this.loops.link();
  }

}

module.exports = Sprite;
