import Mixin from '@ember/object/mixin';

export default Mixin.create({

  didAddNodeForComponent(component) {
    let { node } = component;
    node.zIndex(component.resolveZIndex());
  },

  registerChildComponent(component) {
    this.node.add(component.node);
    this.didAddNodeForComponent(component);
  },

  unregisterChildComponent(component) {
    component.node.remove();
  }

});
