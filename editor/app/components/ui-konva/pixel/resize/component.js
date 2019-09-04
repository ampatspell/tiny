import Node from '../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  disabled: false,

  pixel: null,
  size: null,

  color: '#60befd',

  bounds: computed('pixel', 'size', function() {
    let { pixel, size } = this;
    if(!pixel || !size) {
      return;
    }
    let width = size.width * pixel;
    let height = size.height * pixel;
    let x = 0;
    let y = 0;
    return { x, y, width, height };
  }).readOnly(),

  position: computed('bounds', function() {
    let { bounds } = this;
    if(!bounds) {
      return;
    }
    let { x, y, width, height } = bounds;
    let calc = (position, size) => ({ min: position - 0.5, mid: position + (size / 2) + 0.5, max: position + size + 0.5 });
    return {
      x: calc(x, width),
      y: calc(y, height)
    };
  }).readOnly(),

  actions: {
    clamp(id, delta) {
      let { pixel } = this;
      let calc = key => (Math.floor(delta[key] / pixel) * pixel);
      if(id === 'right' || id === 'left') {
        return {
          x: calc('x'),
          y: 0
        };
      } else if(id === 'top' || id === 'bottom') {
        return {
          x: 0,
          y: calc('y')
        };
      }
    },
    commit(id, delta) {
      let { pixel } = this;
      let calc = key => (delta[key] / pixel);
      let diff = {
        x: calc('x'),
        y: calc('y'),
      };
      if(id === 'left') {
        diff.x = -diff.x;
      } else if(id === 'top') {
        diff.y = -diff.y;
      }
      console.log(diff);
    }
  }

});
