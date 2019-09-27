import Node from '../-node';
import { computed } from '@ember/object';

const mapping = {
  'red':   'rgba(255, 102, 97, 0.4)',
  'green': 'rgba(97, 255, 123, 0.5)',
  'black': '#000',
  'white': '#fff'
};

export default Node.extend({

  nodeClassName: 'group',

  fill: computed('model.color', function() {
    return mapping[this.model.color];
  }).readOnly(),

});
