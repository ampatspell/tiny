import Node from '../../../-node';
import { computed } from '@ember/object';

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

  nodeClassName: 'rect',

  size: null,
  background: null,
  pixel: null,

  frame: computed('size', 'pixel', function() {
    let { pixel, size } = this;
    return {
      x: -0.5,
      y: -0.5,
      width: size.width * pixel + 1,
      height: size.height * pixel + 1
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
