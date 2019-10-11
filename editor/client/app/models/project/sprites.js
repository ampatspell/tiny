import filteredEntities from './-filtered-entities';
import { assign } from '@ember/polyfills';
import { readOnly } from '@ember/object/computed';

const Sprites = filteredEntities('sprite');

export default Sprites.extend({

  project: readOnly('model'),

  async didCreate(model) {
    await this.project.didCreateSprite(model);
  },

  async create(opts) {
    let {
      identifier,
      position,
      size,
      pixel
    } = assign({
      identifier: 'new-sprite',
      position: { x: 4, y: 6 },
      size: { width: 16, height: 16 },
      pixel: 2
    }, opts);

    let model = await this.createModel({ type: 'sprite', identifier, position, size, pixel });
    await this.didCreate(model);
    return model;
  },

  async createFromTemplate() {
    let sprite = await this.create();
    await sprite.frames.createFromTemplate();
    return sprite;
  }

});
