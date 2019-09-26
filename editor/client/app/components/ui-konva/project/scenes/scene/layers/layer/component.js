import Node from '../../../../../-node';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';

const observe = [ 'listening' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  listening: not('model.chainLocked'),

  props: computed('index', 'listening', function() {
    let { index, listening } = this;
    return {
      zIndex: index,
      listening
    };
  }).readOnly()

});
