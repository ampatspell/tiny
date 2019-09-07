import Node from '../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  fill: computed('sceneNode.color', function() {
    let { sceneNode: { color } } = this;
    if(color === 'black') {
      return '#000';
    } else if(color === 'white') {
      return '#fff';
    }
  }).readOnly()

});
