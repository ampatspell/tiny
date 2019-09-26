import Node from '../../../../../../../-node';
import { readOnly, not } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',
  observe: Object.freeze([ 'pixelFrame', 'listening' ]),

  pixelFrame: readOnly('model.pixelFrame'),
  listening: not('model.chainLocked'),

  props: computed('pixelFrame', 'listening', function() {
    let { pixelFrame: { x, y }, listening } = this;
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
