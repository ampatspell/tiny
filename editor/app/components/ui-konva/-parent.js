import Mixin from '@ember/object/mixin';

const indexOf = (arr, item) => Array.prototype.indexOf.call(arr, item);

export default Mixin.create({

  didAddNodeForComponent(component) {
    let { node } = component;
    let el = component.element;
    let idx = indexOf(el.parentElement.children, el);
    node.zIndex(idx);
  },

  registerChildComponent(component) {
    this.node.add(component.node);
    this.didAddNodeForComponent(component);
  },

  unregisterChildComponent(component) {
    component.node.remove();
  }

});
