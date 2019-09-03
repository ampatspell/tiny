import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-foobar' ],

  ready: false,

  pixels: computed(function() {
    let model = this.store.models.create('pixels', { path: 'pixels/one' });
    model.load();
    return model;
  }).readOnly(),

  actions: {
    toggle(pixel) {
      pixel.update(!pixel.value);
    },
    shuffle() {
      let random = () => Math.round(Math.random());
      this.pixels.columns.forEach(column => column.rows.forEach(pixel => pixel.update(random())));
    }
  }

  // actions: {
  //   toggle(pixel) {
  //     pixel.set('value', pixel.value === 0 ? 1 : 0);
  //   },
  // },

  // didInsertElement() {
  //   this._super(...arguments);
  //   //remove
  //   window.addEventListener('mousedown', e => run(() => this.windowMouseDown(e)));
  //   window.addEventListener('mouseup', e => run(() => this.windowMouseUp(e)));
  //   window.addEventListener('mousemove', e => run(() => this.windowMouseMove(e)));
  //   //cancel
  //   next(() => this.setProperties({ ready: true }));
  // },

  // windowMouseDown() {
  //   // e.target is child of this
  //   this.set('down', true);
  // },

  // windowMouseUp() {
  //   this.set('down', false);
  // },

  // windowMouseMove(e) {
  //   if(!this.down) {
  //     return;
  //   }

  //   let { clientX, clientY } = e;
  //   let el = document.elementFromPoint(clientX, clientY);
  //   if(!el) {
  //     return;
  //   }

  //   let { type, x, y } = el.dataset;
  //   // ancestor
  //   if(type !== 'pixel') {
  //     return;
  //   }

  //   x = parseInt(x);
  //   y = parseInt(y);

  //   let pixel = this.rows.objectAt(y).objectAt(x);
  //   pixel.set('value', 1);
  // }

});
