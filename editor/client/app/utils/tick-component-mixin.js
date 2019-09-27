import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({

  tick: service(),

  didInsertElement() {
    this._super(...arguments);
    this.__tickCancel = this.tick.register(() => this.onTick());
    this.onTick();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.__tickCancel();
  },

  onTick() {
  }

});
