import filteredEntities from '../../-filtered-entities';
import { normalized } from 'editor/utils/computed';
import { assign } from '@ember/polyfills';

const Loops = filteredEntities('sprite/loop');

export default Loops.extend({

  model: null,

  _normalize(model) {
    return model || null;
  },

  selected: normalized('_normalize'),

  select(selected) {
    selected = this._normalize(selected);
    if(selected === this.selected) {
      return;
    }
    this.setProperties({ selected });
  },

  async didCreate(model) {
    this.select(model);
  },

  async create(opts) {
    let { identifier } = assign({ identifier: 'new-loop' }, opts);

    let frames = this.model.frames.ordered.map(frame => frame.id);

    let model = await this.createModel({ type: 'sprite/loop', frames, identifier });
    await this.didCreate(model);
    return model;
  },

});
