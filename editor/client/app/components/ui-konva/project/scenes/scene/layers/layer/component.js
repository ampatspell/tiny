import Node from '../../../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  props: computed('index', function() {
    let { index } = this;
    return {
      zIndex: index
    };
  }).readOnly(),

});
