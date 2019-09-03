import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':pixel', 'pixel.value:black' ],

  attributeBindings: [ 'data-x', 'data-y' ],

  'data-x': readOnly('pixel.x'),
  'data-y': readOnly('pixel.y'),

});
