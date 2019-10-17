import EmberObject, { computed } from '@ember/object';
import { normalized } from 'editor/utils/computed';

export default EmberObject.extend({

  project: null,

  _normalizeModel(model) {
    return model || this.project;
  },

  _normalizeEditing(model) {
    return model || null;
  },

  _model: normalized('_normalizeModel'),
  _editing: normalized('_normalizeEditing'),

  model: computed('_model', function() {
    return this._model;
  }).readOnly(),

  editing: computed('_editing.render.editable', function() {
    let { _editing } = this;
    if(!_editing || !_editing.render.editable) {
      return;
    }
    return _editing;
  }).readOnly(),

  select(_model) {
    if(this._normalizeModel(_model) === this._model) {
      return;
    }
    this.edit(null);
    this.setProperties({ _model });
  },

  edit(_editing) {
    if(this._normalizeEditing(_editing) === this._editing) {
      return;
    }
    this.setProperties({ _editing });
  },

  deselect() {
    this.edit(null);
    this.select(null);
  },

});
