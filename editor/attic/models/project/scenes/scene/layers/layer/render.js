import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  model: null,

  scene: readOnly('model.scene'),

  selection: computed('scene', function() {
    let { scene } = this;
    return [ scene ];
  }).readOnly()

});
