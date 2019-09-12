import Component from '@ember/component';
import { assign } from '@ember/polyfills';

export default Component.extend({
  classNameBindings: [ ':flip' ],

  actions: {
    update(key, value) {
      let hash = assign({}, this.value, { [key]: value });
      this.update(hash);
    }
  }

});
