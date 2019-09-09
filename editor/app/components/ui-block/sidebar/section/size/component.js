import Component from '@ember/component';
import { assign } from '@ember/polyfills';

export default Component.extend({
  classNameBindings: [ ':size' ],

  actions: {
    update(key, value) {
      value = parseInt(value);
      if(!value || isNaN(value)) {
        return;
      }
      let hash = assign({}, this.value, { [key]: value });
      this.update(hash);
    }
  }

});
