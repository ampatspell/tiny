import EmberObject from '@ember/object';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-foobar' ],

  rows: computed(function() {
    let rows = A();
    for(let y = 0; y < 64; y++) {
      let col = A();
      for(let x = 0; x < 128; x++) {
        col.push(EmberObject.create({ x, y, value: Math.round(Math.random()) }));
      }
      rows.push(col);
    }
    return rows;
  }).readOnly(),

  actions: {
    toggle(pixel) {
      pixel.set('value', pixel.value === 0 ? 1 : 0);
    }
  }

});
