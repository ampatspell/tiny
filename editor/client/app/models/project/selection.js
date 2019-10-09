import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({

  project: null,

  _normalize(model) {
    return model || this.project;
  },

  model: computed({
    get() {
      return this._normalize(this._model);
    },
    set(key, value) {
      value = this._normalize(value);
      this._model = value;
      return value;
    }
  }),

  select(model) {
    if(this._normalize(model) === this.model) {
      return;
    }
    this.setProperties({ model });
    setGlobal({ selection: model });
  }

});
