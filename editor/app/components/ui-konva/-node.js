import Component from '@ember/component';
import Parent from './-parent';
import Events from './-events';
import { computed } from '@ember/object';
import Konva from 'konva';

export default Component.extend(Parent, Events, {
  // needs element because of -parent.js node.zIndex
  // tagName: '',

  props: null,

  node: computed(function() {
    let node = this.createNode(Konva);
    node.component = this;
    this.addNodeEventListeners(node);
    return node;
  }).readOnly(),

  getNodeAttributes() {
    let { node } = this;
    return node.getAttrs();
  },

  updateNodeAttributes() {
    let { node, props } = this;
    props && node.setAttrs(props);
  },

  drawLayer() {
    let layer = this.node.getLayer();
    layer && layer.batchDraw();
  },

  createNode() {
  },

  destroyNode() {
    this.node.destroy();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.updateNodeAttributes();
    this.drawLayer();
  },

  didInsertElement() {
    this._super(...arguments);
    this.parentView.registerChildComponent(this);
  },

  willDestroyElement() {
    this.parentView.unregisterChildComponent(this);
    this.destroyNode();
    this._super(...arguments);
  }

});
