import Component from '../component';
import { next } from 'editor/utils/runloop';

export default Component.extend({
  classNameBindings: [ ':ui-dialog-alert' ],
  attributeBindings: [ 'tabindex' ],

  tabindex: 0,

  actions: {
    async invoke(action) {
      let { status, fn } = action;
      try {
        await this.invokeFunction(fn);
      } finally {
        this.dialog.resolve({ status });
      }
    }
  },

  async invokeFunction(fn) {
    if(!fn) {
      return;
    }

    this.set('isBusy', true);

    await next();
    await fn();
  },

  didInsertElement() {
    this._super(...arguments);
    this.element.focus();
  }

});
