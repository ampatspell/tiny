import Node from '../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'scene.position' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  scene: null,
  pixel: null,

  props: computed('pixel', 'scene.position', function() {
    let { pixel, scene: { osition } } = this;
    return {
      x: position.x * pixel,
      y: position.y * pixel
    };
  }),

});
