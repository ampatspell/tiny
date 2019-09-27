import Component from '@ember/component';
import Parent from './-parent';
import Events from './-events';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';
import { assert } from '@ember/debug';
import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import Konva from 'konva';

export default Component.extend(Parent, Events, {
  tagName: '',

  concatenatedProperties: Object.freeze([ 'observe' ]),
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

  setNodeAttributes(props) {
    let { node } = this;
    return node.setAttrs(props);
  },

  nodeAttributesChanged(current, props) {
    return !!Object.keys(props).find(key => current[key] !== props[key]);
  },

  resolveZIndex() {
    let { zIndex } = this;
    if(zIndex !== undefined) {
      let { node } = this;
      if(!node.parent) {
        return;
      }
      if(zIndex >= node.parent.children.length) {
        return;
      }
      return zIndex;
    }
  },

  updateNodeAttributes() {
    let { node, props } = this;

    let zIndex = this.resolveZIndex();
    if(zIndex !== undefined && node.parent) {
      props = assign({}, props, { zIndex });
    }

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

  drawLayer(layer) {
    layer = layer || this.node.getLayer();
    if(layer) {
      layer.drawHit();
      layer.batchDraw();
    }
  },

  updateNodeAttributesAndDraw(force) {
    if(this.updateNodeAttributes() || force) {
      this.drawLayer();
    }
  },

  destroyNode() {
    let { node } = this;
    this.removeNodeEventListeners(node);
    node.destroy();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.updateNodeAttributesAndDraw();
  },

  updateZIndex() {
    let zIndex = this.resolveZIndex();
    if(zIndex !== undefined) {
      this.node.zIndex(zIndex);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.parentView.registerChildComponent(this);
    this.updateZIndex();
    this.updateNodeAttributesAndDraw(true);
    this.startObservingProperties();
  },

  willDestroyElement() {
    this.stopObservingProperties();
    let layer = this.node.getLayer();
    this.parentView.unregisterChildComponent(this);
    this.destroyNode();
    this.drawLayer(layer);
    this._super(...arguments);
  },

  //

  getRelativePointerPosition() {
    let { node } = this;
    let pos = node.getStage().getPointerPosition();
    let transform = node.getAbsoluteTransform().copy();
    transform.invert();
    return transform.point(pos);
  },

  //

  observedPropertyDidChange() {
    this.updateNodeAttributesAndDraw();
  },

  startObservingProperties() {
    A(this.observe).forEach(key => this.addObserver(key, this, this.observedPropertyDidChange));
  },

  stopObservingProperties() {
    A(this.observe).forEach(key => this.removeObserver(key, this, this.observedPropertyDidChange));
  },

  //

  disableImageSmoothing() {
    let { node } = this;
    if(!node) {
      return;
    }
    let layer = node.getLayer();
    if(!layer) {
      return;
    }
    let native = layer.getContext()._context;
    native.imageSmoothingEnabled = false;
  },

  //

  // workaround for messed up konva doubleclick
  isDoubleClick() {
    let now = new Date();
    let last = this._lastClick;
    let ret = false;
    if(last && now - last < 300) {
      last = null;
      ret = true;
    } else {
      last = now;
    }
    this._lastClick = last;
    return ret;
  },

});
