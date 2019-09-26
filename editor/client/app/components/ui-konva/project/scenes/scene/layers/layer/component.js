import Node from '../../../../../-node';
import { computed } from '@ember/object';

const observe = [ 'index' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  props: computed('index', function() {
    let { index } = this;
    return {
      zIndex: index
    };
  }).readOnly(),

});
