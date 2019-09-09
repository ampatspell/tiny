import Node from '../../../../-node';
import { computed } from '@ember/object';

const observe = [ 'scene.size' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  clipFunc: computed('scene.size', 'pixel', function() {
    let { scene: { size }, pixel } = this;
    let width = size.width * pixel;
    let height = size.height * pixel;
    return ctx => {
      ctx.rect(0, 0, width, height);
    };
  }).readOnly(),

  props: computed('clipFunc', function() {
    let { clipFunc } = this;
    return {
      clipFunc
    }
  }).readOnly(),

});
