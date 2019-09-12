import Service from '@ember/service';
import { mapBy } from '@ember/object/computed';
import { array } from 'editor/utils/computed'

export default Service.extend({

  models: array(),

  items: mapBy('models', 'breadcrumb'),

  add(model) {
    if(!model || !model.breadcrumb) {
      return;
    }
    this.models.pushObject(model);
  },

  remove(model) {
    if(!model) {
      return;
    }
    this.models.removeObject(model);
  }

});
