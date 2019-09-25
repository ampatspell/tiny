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
  pixelFrame: readOnly('model.pixelFrame'),

  frame: computed('pixelFrame', function() {
    let { pixelFrame } = this;
    return {
      x: -0.5,
      y: -0.5,
      width: pixelFrame.width + 1,
      height: pixelFrame.height + 1
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
