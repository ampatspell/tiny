import Node from '../../../../../../../-node';
import { readOnly, not } from '@ember/object/computed';
import { computed } from '@ember/object';

const observe = [ 'frame', 'listening' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  frame: readOnly('model.render.frame'),
  listening: not('model.chainLocked'),

  props: computed('frame', 'listening', function() {
    let { frame: { x, y }, listening } = this;
    return {
      x,
      y,
      listening
    };
  }).readOnly(),

  onClick(e) {
    e.cancelBubble = true;
    this.model.select();
  }

});
