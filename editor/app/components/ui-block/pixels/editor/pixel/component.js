import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const mapping = {
  0: 'transparent',
  1: 'black',
  2: 'white'
};

export default Component.extend({
  classNameBindings: [ ':pixel', 'type' ],

  attributeBindings: [ 'data-type', 'data-x', 'data-y' ],

  'data-type': 'pixel',

  'data-x': readOnly('pixel.x'),
  'data-y': readOnly('pixel.y'),

  value: readOnly('pixel.value'),

  type: computed('value', function() {
    let { value } = this;
    return mapping[value];
  }).readOnly(),

});
