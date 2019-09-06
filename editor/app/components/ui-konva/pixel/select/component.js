import Node from '../../-node';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';

export default Node.extend({

  nodeClassName: 'group',

  pixel: null,
  size: null,

  disabled: computed({
    get() {
      return this._disabled;
    },
    set(key, value) {
      this._disabled = value;
      if(!value) {
        this.set('state', null);
      }
      return value;
    }
  }),

  state: null,

  actions: {
    update(state) {
      this.setProperties({ state });
    },
    begin(opts) {
      this.set('move', this.begin(opts));
    },
    move(opts) {
      this.move(opts);
    },
    end() {
    }
  }

});
