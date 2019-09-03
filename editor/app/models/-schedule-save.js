import Mixin from '@ember/object/mixin';
import { later, cancel } from '@ember/runloop';
import alive from '../utils/alive';

const delay = 300;

export default Mixin.create({

  cancelScheduledSave() {
    cancel(this._scheduledSave);
  },

  performScheduledSave: alive(function() {
    this.save();
  }),

  scheduleSave() {
    this.cancelScheduledSave();
    this._scheduledSave = later(() => this.performScheduledSave(), delay);
  },

  willDestroy() {
    this._super(...arguments);
    this.cancelScheduledSave();
  }

});
