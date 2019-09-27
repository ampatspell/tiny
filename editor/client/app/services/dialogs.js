import Service from '@ember/service';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { assign } from '@ember/polyfills';
import { array } from 'editor/utils/computed';
import AlertMixin from './dialogs/-alert';

export default Service.extend(AlertMixin, {

  presenters: array(),
  models: array(),

  registerPresenter(component) {
    this.presenters.pushObject(component);
  },

  unregisterPresenter(component) {
    this._cancelAll(component);
    this.presenters.removeObject(component);
  },

  presenter(label, required=true) {
    let presenter = this.presenters.findBy('label', label);
    assert(`presenter '${label}' not registered`, !!presenter || !required);
    return presenter;
  },

  _cancelAll(presenter) {
    let models = this.models.filterBy('presenter', presenter);
    models.forEach(model => model.cancel());
  },

  _remove(model) {
    this.models.removeObject(model);
  },

  model(dialog, presenter, opts) {
    let dialogs = this;
    return getOwner(this).factoryFor('model:dialog').create(assign({ dialogs, dialog, presenter }, opts));
  },

  present(label, name, opts) {
    let presenter = this.presenter(label || 'application');
    let model = this.model(name, presenter, opts);
    this.models.pushObject(model);
    return model.promise;
  }

});
