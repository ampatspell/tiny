const Entity = require('./entity');
const Frames = require('./sprite/frames');
const Loops = require('./sprite/loops');

class Sprite extends Entity {

  constructor(project, json) {
    super(project, json);
    this.size = json.size;
  }

  link() {
    super.link();
    this.frames = new Frames(this, this.models.filter(model => model.type === 'sprite/frame'));
    this.loops = new Loops(this, this.models.filter(model => model.type === 'sprite/loop'));
    this.frames.link();
    this.loops.link();
  }

}

module.exports = Sprite;
