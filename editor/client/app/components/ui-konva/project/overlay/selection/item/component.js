import Node from '../../../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'frame' ];

export default Node.extend({

  nodeClassName: 'rect',
  observe,

  model: null,

  opacity: 0.75,

  inset: readOnly('model.render.selectionInset'),
  frame: readOnly('model.render.absolute'),

  _frame: computed('frame', 'inset', function() {
    let { frame, inset } = this;
    inset = inset || 0.5;
    return {
      x: frame.x - inset,
      y: frame.y - inset,
      width: frame.width + (2 * inset),
      height: frame.height + (2 * inset)
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
  })

});
