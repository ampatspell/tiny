import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  model: null,

  pixel: readOnly('model.pixel'),
  selection: readOnly('model.selection.render.selection')

});
