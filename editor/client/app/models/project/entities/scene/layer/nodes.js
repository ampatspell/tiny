import filteredEntities from '../../../-filtered-entities';

const Nodes = filteredEntities('scene/layer/node');

export default Nodes.extend({

  model: null,

  onParentResized(id, diff) {
    this.models.forEach(model => model.onParentResized(id, diff));
  },

  async didCreate(model) {
    model.select();
  },

  async create(opts) {
    let model = await this.createModel(opts);
    await this.didCreate(model);
    return model;
  },

  createFillNode() {
    return this.create({
      type: 'scene/layer/node/fill',
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 8,
        height: 8
      },
      color: 'black'
    });
  },

  async _createSpriteNode(type, cb) {
    // TODO: sprite
    let sprite = null;
    let opts = cb(sprite);
    if(sprite) {
      sprite = sprite.identifier;
    }
    await this.create({
      type: `scene/layer/node/sprite/${type}`,
      position: {
        x: 0,
        y: 0,
      },
      alignment: {
        vertical: 'top',
        horizontal: 'left'
      },
      flip: {
        horizontal: false,
        vertical: false
      },
      sprite,
      ...opts
    });
  },

  createSpriteFrameNode()  {
    return this._createSpriteNode('frame', sprite => {
      let frame = null;
      if(sprite) {
      }
      return { frame };
    });
  },

  createSpriteLoopNode() {
    return this._createSpriteNode('loop', sprite => {
      let loop = null;
      if(sprite) {
      }
      return { loop };
    });
  },

});
