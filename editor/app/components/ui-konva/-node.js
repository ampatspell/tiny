import Component from '@ember/component';
import Parent from './-parent';
import { computed } from '@ember/object';
import Konva from 'konva';
import { action } from '../../utils/runloop';
import { capitalize } from '@ember/string';

const {
  keys
} = Object;

const _events = [
  'mouseover',
  'mouseout',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mousedown',
  'mouseup',
  'wheel',
  'click',
  'dblclick',
  'dragstart',
  'dragmove',
  'dragend'
];

const events = _events.reduce((hash, name) => {
  hash[`on${capitalize(name)}`] = name;
  return hash;
}, {});

export default Component.extend(Parent, {
  // needs element because of -parent.js node.zIndex
  // tagName: '',

  props: null,

  eventHandlers: computed(function() {
    return keys(events).reduce((hash, f) => {
      let fn = this[f];
      if(fn) {
        hash[events[f]] = (...args) => action(() => fn.call(this, ...args));
      }
      return hash;
    }, {});
  }).readOnly(),

  addEventHandlers(node) {
    let { eventHandlers } = this;
    keys(eventHandlers).map(name => node.on(name, eventHandlers[name]));
  },

  // removeEventHandlers(node) {
  //   let { eventHandlers } = this;
  //   keys(eventHandlers).map(name => node.off(name));
  // },

  node: computed(function() {
    let node = this.createNode(Konva);
    this.addEventHandlers(node);
    return node;
  }).readOnly(),

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
