import Node from '../../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'frame' ];

export default Node.extend({

  nodeClassName: 'rect',
  observe,

  model: null,

  offset: 2,
  opacity: 0.9,

  frame: readOnly('model.render.absolute'),

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
      stroke: `rgba(255,102,97,${opacity})`,
      // dash: [ 5, 3 ],
      strokeWidth: 2,
      listening: false
    };
  })

});
