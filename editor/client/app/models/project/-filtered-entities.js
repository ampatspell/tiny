import EmberObject, { computed } from '@ember/object';
import { filterBy } from '@ember/object/computed';

export default baseType => EmberObject.extend({

  model: null,

  models: filterBy('model.entities.models', 'baseType', baseType),

  ordered: computed('models.@each.index', function() {
    return this.models.slice().sortBy('index');
  }).readOnly(),

  identified: computed('ordered.@each.identifier', function() {
    return this.ordered.filter(model => !!model.identifier);
  }).readOnly()

});
