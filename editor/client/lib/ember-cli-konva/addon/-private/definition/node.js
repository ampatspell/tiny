import EmberObject, { computed } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

export default EmberObject.extend({

  type: null,
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
  },

  build(parent=null) {
    let { type, props, nodes } = this;
    let factory = getOwner(this).factoryFor(`model:${type}`);
    assert(`node model '${type}' is not registered`, !!factory);
    let models = nodes.map(node => node.build(this));
    return factory.create({ parent, type, props, models });
  }

});
