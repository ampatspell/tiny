import Node from '../../../-node';
import { computed } from '@ember/object';

const strokes = {
  'transparent': 'rgba(0,0,0,0.1)',
  'black':       'rgba(255,255,255,0.15)',
  'white':       'rgba(0,0,0,0.05)'
};

export default Node.extend({

  nodeClassName: 'shape',

  grid: null,
  size: null,
  background: null,
  pixel: null,

  frame: computed('size', 'pixel', function() {
    let { pixel, size } = this;
    return {
      x: 0,
      y: 0,
      width: size.width * pixel,
      height: size.height * pixel
    };
  }).readOnly(),

  sceneFunc: computed('grid', 'size', 'background', 'pixel', function() {
    let { grid, size, background, pixel } = this;
    return ctx => {
      let line = (x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.strokeStyle = strokes[background];

      let ph = size.height * pixel;
      for(let x = grid.width; x < size.width; x += grid.width) {
        let px = x * pixel - 0.5;
        line(px, 0, px, ph);
      }

      let pw = size.width * pixel;
      for(let y = grid.height; y < size.height; y += grid.height) {
        let py = y * pixel - 0.5;
        line(0, py, pw, py);
      }
    }
  }).readOnly(),

  props: computed('frame', 'sceneFunc', function() {
    let { frame, sceneFunc } = this;
    return {
      ...frame,
      sceneFunc,
      listening: false
    };
  }),

});
