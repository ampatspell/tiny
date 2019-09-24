import EmberObject, { computed } from '@ember/object';
import { A } from '@ember/array';

export default EmberObject.extend({

  name: null,
  props: null,

  nodes: computed(function() {
    return A();
  }).readOnly(),

  add(node) {
    if(!node) {
      return;
    }
    this.nodes.pushObject(node);
    return this;
  }

});
