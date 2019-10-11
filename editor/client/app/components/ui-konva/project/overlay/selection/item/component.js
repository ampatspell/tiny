import Node from '../../../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'frame' ];

export default Node.extend({

  nodeClassName: 'rect',
  observe,

  model: null,

  opacity: 0.75,

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

  props: computed('frame', 'opacity', function() {
    let { frame, opacity } = this;
    return {
      ...frame,
      stroke: `rgba(96,190,253,${opacity})`,
      strokeWidth: 1,
      listening: false,
      visible: !!frame
    };
  })

});
