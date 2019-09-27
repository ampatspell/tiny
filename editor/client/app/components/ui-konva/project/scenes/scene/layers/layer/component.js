import Node from '../../../../../-node';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';

const observe = [ 'listening' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  listening: not('model.chainLocked'),

  props: computed('listening', function() {
    let { listening } = this;
    return {
      listening
    };
  }).readOnly()

});
