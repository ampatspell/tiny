import EmberObject from '@ember/object';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { run, next } from '@ember/runloop';

const random = () => Math.round(Math.random());

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-foobar' ],

  ready: false,

  rows: computed(function() {
    let rows = A();
    let w = 32;
    let h = 32;
    for(let y = 0; y < h; y++) {
      let col = A();
      for(let x = 0; x < w; x++) {
        col.push(EmberObject.create({ x, y, value: 0 }));
      }
      rows.push(col);
    }
    return rows;
  }).readOnly(),

  actions: {
    toggle(pixel) {
      pixel.set('value', pixel.value === 0 ? 1 : 0);
    },
    shuffle() {
      this.rows.forEach(row => row.forEach(pixel => pixel.set('value', random())));
    }
  },

  didInsertElement() {
    this._super(...arguments);
    window.addEventListener('mousemove', e => run(() => this.move(e)));
    next(() => this.setProperties({ ready: true }));
  },

  mouseDown() {
    this.set('down', true);
  },

  mouseUp() {
    this.set('down', false);
  },

  move(e) {
    if(!this.down) {
      return;
    }

    let { clientX, clientY } = e;
    let el = document.elementFromPoint(clientX, clientY);
    if(!el) {
      return;
    }

    let { x, y } = el.dataset;
    if(!x || !y) {
      return;
    }

    x = parseInt(x);
    y = parseInt(y);

    let pixel = this.rows.objectAt(y).objectAt(x);
    pixel.set('value', 1);
  }

});
