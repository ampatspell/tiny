import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':pixel', 'pixel.value:black' ],

  attributeBindings: [ 'data-type', 'data-x', 'data-y' ],

  'data-type': 'pixel',
  'data-x': readOnly('pixel.x'),
  'data-y': readOnly('pixel.y'),

});
