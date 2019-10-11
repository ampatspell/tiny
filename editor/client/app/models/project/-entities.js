import EmberObject, { computed } from '@ember/object';
import { model } from 'ember-cli-zuglet/lifecycle';

export const entities = name => model().named(`${name}/entities`).mapping(model => ({ model }));

export default EmberObject.extend({

  models: null,

  ordered: computed('models.@each.index', function() {
    return this.models.slice().sortBy('index');
  }).readOnly(),

  reversed: computed('ordered', function() {
    return this.ordered.slice().reverse();
  }).readOnly(),

  identified: computed('ordered.@each.identifier', function() {
    return this.ordered.filter(model => !!model.identifier);
  }).readOnly(),

  visible: computed('ordered.@each.hidden', function() {
    return this.ordered.filter(model => !model.hidden);
  }).readOnly(),

  //

  _moveDelta(model, delta) {
    let { ordered } = this;
    let idx = ordered.indexOf(model);
    if(idx === -1) {
      return;
    }

    idx = idx + delta;
    if(idx < 0 || idx > ordered.length - 1) {
      return;
    }

    let next = ordered.objectAt(idx);
    if(!next) {
      return;
    }

    let { index: modelIndex } = model;
    let { index: nextIndex } = next;

    model.update({ index: nextIndex });
    next.update({ index: modelIndex });
  },

  moveUp(model) {
    this._moveDelta(model, +1);
  },

  moveDown(model) {
    this._moveDelta(model, -1);
  }

});
