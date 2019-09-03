import Component from '../../../../ui-konva/-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const pos = key => computed(`pixel.${key}`, 'size', function() {
  let { pixel, size } = this;
  if(!pixel) {
    return;
  }
  let idx = pixel[key];
  return (size + 1) * idx;
}).readOnly();

export default Component.extend({

  nodeClassName: 'rect',

  size: 5,

  x: pos('x'),
  y: pos('y'),

  width: readOnly('size'),
  height: readOnly('size'),

  fill: computed('pixel.value', function() {
    let { pixel } = this;
    if(!pixel) {
      return 'red';
    }
    return pixel.value ? '#222' : '#eee';
  }).readOnly(),

  props: computed('x', 'y', 'width', 'height', 'fill', function() {
    return this.getProperties('x', 'y', 'width', 'height', 'fill');
  }).readOnly(),

});
