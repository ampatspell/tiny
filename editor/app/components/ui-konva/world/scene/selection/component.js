import Node from '../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  position: null,
  size: null,
  pixel: null,

  offset: 1.5,
  opacity: 0.75,

  _frame: computed('frame', 'pixel', 'offset', function() {
    let { pixel, frame, offset } = this;
    return {
      x: frame.x * pixel - offset,
      y: frame.y * pixel - offset,
      width: frame.width * pixel + (2 * offset),
      height: frame.height * pixel + (2 * offset)
    };
  }).readOnly(),

  props: computed('_frame', 'opacity', function() {
    let { _frame: frame, opacity } = this;
    return {
      ...frame,
      stroke: `rgba(96,190,253,${opacity})`,
      strokeWidth: 1,
      listening: false
    };
  }),

});
