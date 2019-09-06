import Node from '../../../-node';
import { computed } from '@ember/object';

const backgrounds = {
  'transparent': null,
  'black':       '#000',
  'white':       '#fff'
};

const strokes = {
  'transparent': 'rgba(0,0,0,0.1)',
  'black':       'rgba(0,0,0,0)',
  'white':       'rgba(0,0,0,0.1)',
};

export default Node.extend({

  nodeClassName: 'rect',

  scene: null,
  pixel: null,

  frame: computed('scene.size', 'pixel', function() {
    let { pixel, scene: { size } } = this;
    return {
      x: -0.5,
      y: -0.5,
      width: size.width * pixel + 1,
      height: size.height * pixel + 1
    };
  }).readOnly(),

  style: computed('scene.background', function() {
    let { scene: { background } } = this;
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
