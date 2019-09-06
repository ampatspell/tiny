import Node from '../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  scene: null,

  props: computed(function() {
    return {
      x: 10,
      y: 10
    };
  }),

});
