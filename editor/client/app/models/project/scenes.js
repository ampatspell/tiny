import filteredEntities from './-filtered-entities';
import { assign } from '@ember/polyfills';
import { readOnly } from '@ember/object/computed';

const Scenes = filteredEntities('scene');

export default Scenes.extend({

  project: readOnly('model'),

  async didCreate(model) {
    await this.project.didCreateScene(model);
  },

  async create(opts) {
    let {
      identifier,
      position,
      size,
      background,
      expanded
    } = assign({
      identifier: 'new-scene',
      position: {
        x: 4,
        y: 6
      },
      size: {
        width: 128,
        height: 64
      },
      background: 'white',
      expanded: true
    }, opts);

    let model = await this.createModel({ type: 'scene', identifier, position, size, background, expanded });
    await this.didCreate(model);
    return model;
  }

});
