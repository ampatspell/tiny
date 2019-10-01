import Component from '@ember/component';
import dragula from 'dragula';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import { run } from '@ember/runloop';
import { A } from '@ember/array';

const events = {
  cloned: 'onCloned',
  drag:   '_onDrag',
  drop:   '_onDrop'
};

const mapDataIds = target => {
  let indexes = target.querySelectorAll('[data-id]');
  let array = A();
  indexes.forEach(el => {
    let id = el.dataset.id;
    array.push(id);
  });
  return array;
}

export default Component.extend({
  classNameBindings: [ ':ui-block-dragula' ],

  _events: computed(function() {
    let wrap = fn => (...args) => run(() => fn.call(this, ...args));
    return Object.keys(events).reduce((hash, name) => {
      let fn = this[events[name]];
      if(fn) {
        hash[name] = wrap(fn);
      }
      return hash;
    }, {});
  }).readOnly(),

  _withEvents(cb) {
    let { drake, _events } = this;
    Object.keys(_events).forEach(name => cb(drake, name, _events[name]));
  },

  init() {
    this._super(...arguments);
    let mirrorContainer = document.querySelector('.ui-application');
    let moves = () => !this.disabled;
    this.drake = dragula(assign({ mirrorContainer, moves }, this.options));
    this._withEvents((drake, name, fn) => drake.on(name, fn));
  },

  addContainer(component) {
    this.drake.containers.push(component.element);
  },

  removeContainer(component) {
    this.drake.containers.splice(this.drake.containers.indexOf(component.element), 1);
  },

  willDestroy() {
    this.drake.destroy();
    this._super(...arguments);
  },

  onCloned(clone) {
    clone.removeAttribute('id');
  },

  _onDrag(el, source) {
    let sibling = el.nextSibling;
    this.dragging = { el, sibling, source };
  },

  _onDrop(_, target) {
    let ids = mapDataIds(target);

    let { el, sibling, source } = this.dragging;
    this.dragging = null;

    source.removeChild(el);
    source.insertBefore(el, sibling);

    this.onDrop && this.onDrop(ids);
  }

});
