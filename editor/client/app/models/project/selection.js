import EmberObject from '@ember/object';
import { normalized } from 'editor/utils/computed';

export default EmberObject.extend({

  project: null,

  _normalize(model) {
    return model || this.project;
  },

  model: normalized('_normalize'),

  select(model) {
    if(this._normalize(model) === this.model) {
      return;
    }
    this.setProperties({ model });
    setGlobal({ selection: model });
  }

});
