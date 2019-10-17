import EmberObject from '@ember/object';
import { normalized } from 'editor/utils/computed';

export default EmberObject.extend({

  project: null,

  _normalizeModel(model) {
    return model || this.project;
  },

  _normalizeEditing(model) {
    return model || null;
  },

  model: normalized('_normalizeModel'),
  editing: normalized('_normalizeEditing'),

  select(model) {
    if(this._normalizeModel(model) === this.model) {
      return;
    }
    this.setProperties({ model });
  },

  edit(editing) {
    if(this._normalizeEditing(editing) === this.editing) {
      return;
    }
    this.setProperties({ editing });
  },

  deselect() {
    this.edit(null);
    this.select(null);
  },

});
