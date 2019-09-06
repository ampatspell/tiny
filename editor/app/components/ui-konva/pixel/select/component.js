import Node from '../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  pixel: null,
  size: null,

  disabled: computed({
    get() {
      return this._disabled;
    },
    set(key, value) {
      this._disabled = value;
      if(!value) {
        this.set('state', null);
      }
      return value;
    }
  }),

  state: null,

  actions: {
    beginDraw({ x, y }) {
      this.set('state', { phase: 'drawing', x, y, width: 0, height: 0 });
      this.move = null;
    },
    updateDraw({ width, height }) {
      let { state: { x, y } } = this;
      this.set('state', { phase: 'drawing', x, y, width, height });
    },
    endDraw() {
      let { state } = this;
      if(!state) {
        return;
      }
      let { x, y, width, height } = state;
      this.set('state', { phase: 'moving', x, y, width, height });
    },
    beginMove() {
      if(this.move) {
        return;
      }
      let { state: { x, y, width, height } } = this;
      this.set('move', this.begin({ x, y, width, height }));
    },
    updateMove(pos) {
      this.move(pos);
      this.pos = pos;
    },
    endMove() {
      let { state: { width, height }, pos } = this;
      this.set('state', { phase: 'moving', x: pos.x, y : pos.y, width, height });
    },
  }

});
