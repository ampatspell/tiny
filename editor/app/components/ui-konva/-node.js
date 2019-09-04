import Component from '@ember/component';
import Parent from './-parent';
import Events from './-events';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';
import { assert } from '@ember/debug';
import Konva from 'konva';

export default Component.extend(Parent, Events, {
  // needs element because of -parent.js node.zIndex
  // tagName: '',

  nodeClassName: null,
  props: null,

  createNode(Konva) {
    let className = this.nodeClassName;
    assert(`provide 'className' or override createNode method`, !!className);
    className = capitalize(className);
    let factory = Konva[className];
    assert(`${className} must be valid Konva class`, !!factory)
    return new factory();
  },

  node: computed(function() {
    let node = this.createNode(Konva);
    node.component = this;
    this.addNodeEventListeners(node);
    return node;
  }).readOnly(),

  nodeAttributes() {
    let { node } = this;
    return node.getAttrs();
  },

  nodeAttributesChanged(current, props) {
    return !!Object.keys(props).find(key => current[key] !== props[key]);
  },

  updateNodeAttributes() {
    let { node, props } = this;
    if(!props) {
      return false;
    }

    let current = node.getAttrs();
    if(!this.nodeAttributesChanged(current, props)) {
      return false;
    }

    node.setAttrs(props);

    return true;
  },

  drawLayer() {
    let layer = this.node.getLayer();
    layer && layer.batchDraw();
  },

  destroyNode() {
    this.node.destroy();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if(this.updateNodeAttributes()) {
      this.drawLayer();
    }
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
