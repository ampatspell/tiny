import Node from '../../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'frame' ];

export default Node.extend({

  nodeClassName: 'rect',
  observe,

  model: null,
  stroke: null,

  inset: readOnly('model.render.highlightInset'),
  absolute: readOnly('model.render.absolute'),

  frame: computed('absolute', 'inset', function() {
    let { absolute, inset } = this;
    if(!absolute) {
      return {};
    }
    inset = inset || 0.5;
    return {
      x: absolute.x - inset,
      y: absolute.y - inset,
      width: absolute.width + (2 * inset),
      height: absolute.height + (2 * inset)
    };
  }).readOnly(),

  props: computed('frame', 'stroke', function() {
    let { frame, stroke } = this;
    return {
      ...frame,
      stroke,
      strokeWidth: 1,
      listening: false,
      visible: !!frame
    };
  })

});
