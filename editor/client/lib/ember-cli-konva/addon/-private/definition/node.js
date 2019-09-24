import EmberObject, { computed } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

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
  },

  build() {
    let { name, props, nodes } = this;
    let factory = getOwner(this).factoryFor(`model:${name}`);
    assert(`node model '${name}' is not registered`, !!factory);
    nodes = nodes.map(node => node.build());
    return factory.create({ name, props, nodes });
  }

});
