import Node from './node';
import { next, cancel } from '@ember/runloop';

export default Node.extend({

  nodeClassName: 'Layer',

  setDirty() {
    this.scheduleBatchDraw();
  },

  scheduleBatchDraw() {
    cancel(this._scheduleBatchDraw);
    this._scheduleBatchDraw = next(() => this._node.batchDraw());
  }

});
