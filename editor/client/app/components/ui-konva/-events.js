import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';
import { run } from '@ember/runloop';

const events = [
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
  'dragend',
  'contentMouseup'
];

export default Mixin.create({

  nodeEventHandlers: computed(function() {
    return events.reduce((hash, name) => {
      let f = `on${capitalize(name)}`;
      let fn = this[f];
      if(fn) {
        hash[name] = (...args) => run(() => fn.call(this, ...args));
      }
      return hash;
    }, {});
  }).readOnly(),

  _withEventHandlers(cb) {
    let handlers = this.nodeEventHandlers;
    Object.keys(handlers).map(name => cb(name, handlers[name]));
  },

  addNodeEventListeners(node) {
    this._withEventHandlers((name, fn) => node.on(name, fn));
    return node;
  },

  removeNodeEventListeners(node) {
    this._withEventHandlers(name => node.off(name));
    return node;
  },

});
