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

  visible: computed('models.@each.hidden', function() {
    return this.models.filter(model => !model.hidden);
  }).readOnly()

});
