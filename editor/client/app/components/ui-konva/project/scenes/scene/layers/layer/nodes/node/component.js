import Node from '../../../../../../../-node';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',
  observe: Object.freeze([ 'frame' ]),

  pixelFrame: readOnly('model.pixelFrame'),

  props: computed('pixelFrame', function() {
    let { pixelFrame: { x, y } } = this;
    return {
      x,
      y
    };
  }).readOnly(),

});
