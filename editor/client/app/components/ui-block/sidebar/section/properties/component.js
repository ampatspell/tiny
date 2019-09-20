import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { assign } from '@ember/polyfills';

export default Component.extend({
  classNameBindings: [ ':properties' ],

  properties: computed('value', function() {
    let { value } = this;
    if(!value) {
      console.log('no value', value);
      value = [];
    }
    return value;
  }).readOnly(),

  actions: {
    add() {
      let { properties } = this;
      properties = properties.slice();
      properties.push({ key: '', value: null });
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

      if(key === 'value') {
        if(value.match(/^[+-]?([0-9]*[.])?[0-9]+$/)) {
          value = parseFloat(value);
        } else if(value === 'true') {
          value = true;
        } else if(value === 'false') {
          value = false;
        } else if(!value) {
          value = null;
        }
      }

      let { properties } = this;
      let idx = properties.indexOf(item);
      properties = properties.slice();
      properties[idx] = assign({}, properties[idx], { [key]: value });
      this.update(properties);
    }
  },

});
