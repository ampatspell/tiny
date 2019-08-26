import Mixin from '@ember/object/mixin';

export default Mixin.create({

  registerChildComponent(component) {
    let { node } = component;
    this.node.add(node);
  },

  unregisterChildComponent(component) {
    component.node.remove();
  }

});
