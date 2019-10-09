import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({

  project: null,

  model: computed({
    get() {
      return this._model || this.project;
    },
    set(key, value) {
      value = value || this.project;
      this._model = value;
      return value;
    }
  }),

  select(model) {
    this.setProperties({ model });
    setGlobal({ selection: model });
  }

});
