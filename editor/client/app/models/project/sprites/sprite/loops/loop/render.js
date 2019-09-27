import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  model: null,

  sprite: readOnly('model.sprite'),

  selection: computed('sprite', function() {
    let { sprite } = this;
    return [ sprite ];
  }).readOnly()

});
