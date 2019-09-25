import Node from '../../../../../../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',
  observe: Object.freeze([ 'pixelFrame' ]),

  pixelFrame: readOnly('model.pixelFrame'),

  props: computed('pixelFrame', function() {
    let { pixelFrame } = this;
    return {
      x: pixelFrame.x,
      y: pixelFrame.y,
    };
  }).readOnly(),

});
