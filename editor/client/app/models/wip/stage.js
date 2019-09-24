import Node from './-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'Stage',

  renderer: null,

  attributes: computed('renderer.{container,size}', function() {
    let { renderer: { container, size: { width, height } } } = this;
    return {
      container,
      width,
      height
    };
  }).readOnly(),

  bind(renderer) {
    this.setProperties({ renderer });
    this._super();
    this.node.batchDraw(); // TODO
  },

});
