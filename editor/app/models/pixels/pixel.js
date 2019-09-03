import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  column: null,

  x: null,
  y: readOnly('column.y'),

  index: computed('column.pixels.size.{width,height}', 'x', 'y', function() {
    let { x, y, column: { pixels: { size } } } = this;
    if(!size) {
      return;
    }
    let { width } = size;
    return (width * y) + x;
  }).readOnly(),

  value: computed('column.pixels.bytes', 'index', function() {
    let { index, column: { pixels: { bytes } } } = this;
    if(!bytes) {
      return;
    }
    return bytes[index];
  }).readOnly(),

  update(value) {
    this.column.pixels.setByte(this.index, value);
  },

  toStringExtension() {
    return `${this.x},${this.y}`;
  }

});
