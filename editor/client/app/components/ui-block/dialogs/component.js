import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  tagName: '',

  dialogs: service(),
  label: null,

  model: computed('dialogs.models.firstObject.presenter', function() {
    let model = this.dialogs.models.firstObject;
    if(!model || model.presenter !== this) {
      return;
    }
    return model;
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);
    this.dialogs.registerPresenter(this);
  },

  willDestroyElement() {
    this.dialogs.unregisterPresenter(this);
    this._super(...arguments);
  },

  actions: {
    cancel() {
      this.model.cancel();
    }
  },

  toStringExtension() {
    return this.label;
  }

});
