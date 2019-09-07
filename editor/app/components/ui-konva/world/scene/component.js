import Node from '../../-node';
import { computed } from '@ember/object';

const observe = [ 'scene.position' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  scene: null,
  pixel: null,

  props: computed('pixel', 'scene.position', function() {
    let { pixel, scene: { position } } = this;
    return {
      x: position.x * pixel,
      y: position.y * pixel
    };
  }),

  onClick(e) {
    e.cancelBubble = true;
    this.select();
  }

});
