import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { Pixel } from '../../../../../models/pixels';

const mapping = Object.keys(Pixel).reduce((hash, name) => {
  hash[Pixel[name]] = name;
  return hash;
}, {});

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
