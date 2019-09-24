import EmberObject from '@ember/object';
import Konva from 'konva';

export default EmberObject.extend({

  nodeClassName: null,
  node: null,

  createNode() {
    let { node } = this;
    if(node) {
      return;
    }
    let { nodeClassName } = this;
    node = new Konva[nodeClassName](this.attributes);
    this.setProperties({ node });
    this.didCreateNode(node);
  },

  didCreateNode(node) {
    let { parent } = this;
    if(parent) {
      parent.node.add(node);
    }
  },

  bind() {
    this.createNode();
    this.models.forEach(model => model.bind());
  }

});
