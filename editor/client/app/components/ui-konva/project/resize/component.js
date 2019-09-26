import Node from '../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  offset: 1.5,
  opacity: 0.75,

  _frame: computed('frame', 'offset', function() {
    let { frame, offset } = this;
    return {
      x: -offset,
      y: -offset,
      width: frame.width + (2 * offset),
      height: frame.height + (2 * offset)
    };
  }).readOnly(),

  props: computed('_frame', 'opacity', function() {
    let { _frame, opacity } = this;
    return {
      ..._frame,
      stroke: `rgba(255,0,0,${opacity})`,
      strokeWidth: 1,
      listening: false
    };
  }),

});
