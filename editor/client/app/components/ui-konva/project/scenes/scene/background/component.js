import Node from '../../../../-node';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

const observe = [ 'frame', 'style' ];

const backgrounds = {
  'transparent': null,
  'black':       '#222',
  'white':       '#fff'
};

const strokes = {
  'transparent': 'rgba(0,0,0,0.1)',
  'black':       'rgba(255,255,255,0.7)',
  'white':       'rgba(0,0,0,0.1)',
};

export default Node.extend({

  observe,
  nodeClassName: 'rect',

  model: null,

  background: readOnly('model.background'),
  _frame: readOnly('model.render.frame'),

  frame: computed('_frame', function() {
    let { _frame: frame } = this;
    return {
      x: -0.5,
      y: -0.5,
      width: frame.width + 1,
      height: frame.height + 1
    };
  }).readOnly(),

  style: computed('background', function() {
    let { background } = this;
    return {
      fill:  backgrounds[background],
      stroke: strokes[background],
      strokeWidth: 1
    };
  }).readOnly(),

  props: computed('frame', 'style', function() {
    let { frame, style } = this;
    return {
      ...frame,
      ...style
    };
  }),

});
