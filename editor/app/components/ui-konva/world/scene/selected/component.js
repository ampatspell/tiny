import Node from '../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  size: null,
  pixel: null,

  offset: 1.5,

  frame: computed('size', 'pixel', 'offset', function() {
    let { pixel, size, offset } = this;
    return {
      x: -offset,
      y: -offset,
      width: size.width * pixel + (2 * offset),
      height: size.height * pixel + (2 * offset)
    };
  }).readOnly(),

  props: computed('frame', function() {
    let { frame } = this;
    return {
      ...frame,
      stroke: "rgba(96,190,253,0.75)",
      strokeWidth: 1
    };
  }),

});
