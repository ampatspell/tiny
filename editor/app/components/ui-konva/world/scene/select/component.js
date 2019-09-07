import Node from '../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  size: null,
  pixel: null,

  props: computed('size', 'pixel', function() {
    let { size, pixel } = this;
    return {
      x: 0,
      y: 0,
      width: size.width * pixel,
      height: size.height * pixel
    };
  }),

  onClick() {
    this.select();
  }

});
