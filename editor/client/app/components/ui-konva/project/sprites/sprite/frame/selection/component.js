import Node from '../../../../../-node';
import { computed } from '@ember/object';

const observe = [];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  model: null,
  state: null,

  hasSelection: computed('state', function() {
    let { state } = this;
    if(!state) {
      return;
    }
    if(state.width === 0 && state.height === 0) {
      return;
    }
    return true;
  }).readOnly(),

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
      let move = this.model.beginMove({ x, y, width, height });
      this.set('move', move);
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
