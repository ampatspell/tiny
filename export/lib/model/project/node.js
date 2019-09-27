const Properties = require('./properties');

class Node {

  constructor(layer, json) {
    Object.defineProperty(this, 'layer', { value: layer });
    let { identifier, type, sprite, frame, loop, position, alignment, flip, color } = json;
    this.identifier = identifier;
    this.type = type;
    this.position = position;
    this.alignment = alignment;
    this.flip = flip;
    this.color = color;
    this.properties = new Properties(json.properties);
    if(sprite) {
      this.sprite = layer.scene.project.spriteByIdentifier(sprite);
      if(this.sprite) {
        this.frame = this.sprite.frameByIdentifier(frame);
        this.loop = this.sprite.loopByIdentifier(loop);
      }
    }
  }

  get index() {
    return this.layer.nodes.indexOf(this);
  }

}

module.exports = Node;
