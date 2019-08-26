import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Mixin.create({

  childComponents: computed(function() {
    return A();
  }).readOnly(),

  registerChildComponent(component) {
    this.childComponents.addObject(component);
    this.node.add(component.node);
  },

  unregisterChildComponent(component) {
    component.node.remove();
    this.childComponents.removeObject(component);
  }

});
