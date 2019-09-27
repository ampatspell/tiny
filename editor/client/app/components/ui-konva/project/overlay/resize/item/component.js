import Node from '../../../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'frame' ];

export default Node.extend({

  nodeClassName: 'rect',
  observe,

  frame: readOnly('model.render.absolute'),
  pixel: readOnly('model.render.pixel'),

  nodeClassName: 'group',

  disabled: false,

  color: '#60befd',
  resize: null,

  targetSizeString: computed('frame', 'resize', 'pixel', function() {
    let { frame, pixel, resize } = this;
    let calc = (position, size) => {
      let value = frame[size] / pixel;
      if(resize) {
        let _resize = (resize[position] / pixel);
        if(resize.id === 'top' || resize.id === 'left') {
          value -= _resize;
        } else {
          value += _resize;
        }
      }
      return value;
    }
    let x = calc('x', 'width');
    let y = calc('y', 'height');
    return `${x}×${y}`;
  }).readOnly(),

  rect: computed('frame', 'resize', function() {
    let { frame, resize } = this;
    let offset = 1.5;
    let x = frame.x - offset;
    let y = frame.y - offset;
    let width = frame.width + (2 * offset);
    let height = frame.height + (2 * offset);
    if(resize) {
      let { id } = resize;
      if(id === 'right') {
        width += resize.x;
      } else if(id === 'left') {
        x += resize.x;
        width -= resize.x;
      } else if(id === 'top') {
        y += resize.y;
        height -= resize.y;
      } else if(id === 'bottom') {
        height += resize.y;
      }
    }
    return { x, y, width, height };
  }).readOnly(),

  position: computed('frame', function() {
    let { frame } = this;
    if(!frame) {
      return;
    }
    let { x, y, width, height } = frame;
    let calc = (position, size) => ({ min: position - 1.5, mid: position + (size / 2) + 0.5, max: position + size + 1.5 });
    return {
      x: calc(x, width),
      y: calc(y, height)
    };
  }).readOnly(),

  actions: {
    clamp(id, delta) {
      let props = this._clamp(id, delta);
      this.setProperties({ handle: id, resize: { id, ...props }});
      return props;
    },
    commit(id, delta) {
      this.setProperties({ handle: null, resize: null });
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
  },

  commit(id, diff) {
    this.model.onResize(id, diff);
  }

});
