import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { assign } from '@ember/polyfills';

export default Component.extend({
  classNameBindings: [ ':properties' ],

  properties: computed('value', function() {
    let { value } = this;
    if(!value) {
      value = [];
    }
    return value;
  }).readOnly(),

  actions: {
    add() {
      let { properties } = this;
      properties = properties.slice();
      properties.push({ key: '', value: '' });
      this.update(properties);
    },
    delete(item) {
      let { properties } = this;
      let idx = properties.indexOf(item);
      properties = A(properties.slice());
      properties.removeAt(idx);
      this.update(properties);
    },
    update(item, key, value, focus) {
      if(focus === false) {
        return;
      }
      let { properties } = this;
      let idx = properties.indexOf(item);
      properties = properties.slice();
      properties[idx] = assign({}, properties[idx], { [key]: value });
      this.update(properties);
    }
  },

});
