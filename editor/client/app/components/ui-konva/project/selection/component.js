import Node from '../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  offset: 1.5,
  opacity: 0.75,

  _frame: computed('frame', 'offset', function() {
    let { frame, offset } = this;
    return {
      x: frame.x - offset,
      y: frame.y - offset,
      width: frame.width + (2 * offset),
      height: frame.height + (2 * offset)
    };
  }).readOnly(),

  props: computed('_frame', 'opacity', function() {
    let { _frame, opacity } = this;
    return {
      ..._frame,
      stroke: `rgba(96,190,253,${opacity})`,
      strokeWidth: 1,
      listening: false
    };
  }),

});