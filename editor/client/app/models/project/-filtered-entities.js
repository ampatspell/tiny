import EmberObject from '@ember/object';
import { filterBy } from '@ember/object/computed';

export default baseType => EmberObject.extend({

  model: null,

  models: filterBy('model.entities.models', 'baseType', baseType)

});
