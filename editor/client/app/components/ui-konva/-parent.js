import Mixin from '@ember/object/mixin';

export default Mixin.create({

  registerChildComponent(component) {
    this.node.add(component.node);
  },

  unregisterChildComponent(component) {
    component.node.remove();
  }

});
