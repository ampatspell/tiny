import Node from './node';
import { computed } from '@ember/object';

export default Node.extend({

  isStage: true,
  nodeClassName: 'Stage',

  attributes: computed('size', function() {
    let { size, container } = this;
    if(!size) {
      return;
    }
    let { width, height } = size;
    return {
      container,
      width,
      height,
      draggable: true
    };
  }).readOnly(),

  _didCreateNode() {
  },

  mount() {
    this._super();
    this._node.batchDraw();
  }

});
