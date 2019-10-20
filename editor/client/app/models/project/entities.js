import Entities from './-entities';
import { computed } from '@ember/object';

export default Entities.extend({

  model: null,

  models: computed('model.content.models.@each._parent', function() {
    return this.model.content.models.filter(model => model._parent === null);
  }).readOnly()

});
