import Node from '../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  disabled: false,

  pixel: null,
  size: null,

  color: '#60befd',
  resize: null,

  targetSizeString: computed('size', 'resize', 'pixel', function() {
    let calc = (position, size) => {
      let value = this.size[size];
      let { resize, pixel } = this;
      if(resize) {
        // TODO: pixel
        value += (resize[position] / pixel);
      }
      return value;
    }
    let x = calc('x', 'width');
    let y = calc('y', 'height');
    return `${x}×${y}px`;
  }).readOnly(),

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

  rect: computed('bounds', 'resize', function() {
    let { bounds, resize } = this;
    let x = bounds.x - 0.5;
    let y = bounds.y - 0.5;
    let width = bounds.width + 1;
    let height = bounds.height + 1;
    if(resize) {
      let { id } = resize;
      if(id === 'right') {
        width += resize.x;
      } else if(id === 'left') {
        x += resize.x;
      } else if(id === 'top') {
        y += resize.y;
        height -= resize.y;
      } else if(id === 'bottom') {
        height += resize.y;
      }
    }
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
      let props = this._clamp(id, delta);
      this.set('resize', { id, ...props });
      return props;
    },
    commit(id, delta) {
      this.set('resize', null);
      this._commit(id, delta);
    }
  },

  _clamp(id, delta) {
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

  _commit(id, delta) {
    let { pixel } = this;
    let calc = key => (delta[key] / pixel);
    let diff = {
      x: calc('x'),
      y: calc('y'),
    };
    if(diff.x === 0 && diff.y === 0) {
      return;
    }
    if(id === 'left') {
      diff.x = -diff.x;
    } else if(id === 'top') {
      diff.y = -diff.y;
    }
    this.commit(id, diff);
  }

});
