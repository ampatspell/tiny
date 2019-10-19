import filteredEntities from '../../-filtered-entities';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';

const Layers = filteredEntities('scene/layer');

export default Layers.extend({

  model: null,

  onParentResized(id, diff) {
    this.models.forEach(model => model.onParentResized(id, diff));
  },

  async didCreate(model) {
    await this.model.didCreateLayer(model);
  },

  async create(opts) {
    opts = assign({ expanded: true }, opts);
    let model = await this.createModel(opts);
    await this.didCreate(model);
    return model;
  },

  createGridLayer(opts) {
    opts = assign({ type: 'scene/layer/grid', grid: { width: 8, height: 8 } }, opts);
    return this.create(opts);
  },

  createPixelLayer(opts) {
    opts = assign({ type: 'scene/layer/pixel' }, opts);
    return this.create(opts);
  }

});
