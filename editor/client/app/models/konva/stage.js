import Node from './node';
import { computed } from '@ember/object';

export default Node.extend({

  isStage: true,
  nodeClassName: 'Stage',

  attributes: computed('container', 'size', function() {
    let { container, size } = this;
    if(!container || !size) {
      return;
    }
    let { width, height } = size;
    return {
      container,
      width,
      height
    };
  }).readOnly(),

  bind(container, size) {
    this.setProperties({ container, size });
    this.node;
  }

});
