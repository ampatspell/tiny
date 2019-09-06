import Node from '../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  scene: null,
  pixel: null,

  props: computed('pixel', function() {
    let { pixel } = this;
    return {
      x: 10 * pixel,
      y: 10 * pixel
    };
  }),

});
