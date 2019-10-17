import Node from '../../../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'frame', 'stroke' ];

export default Node.extend({

  nodeClassName: 'rect',
  observe,

  model: null,

  opacity: 0.75,

  inset: readOnly('model.render.highlightInset'),
  absolute: readOnly('model.render.absolute'),
  editing: readOnly('model.isEditing'),

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

  stroke: computed('opacity', 'editing', function() {
    let { opacity, editing } = this;
    if(editing) {
      return `rgba(255,102,97,${opacity})`;
    }
    return `rgba(96,190,253,${opacity})`
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
