import Service from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { array } from 'editor/utils/computed';
import { later, cancel } from '@ember/runloop';

export default Service.extend({

  listeners: array(),
  count: readOnly('listeners.length'),

  suspended: 0,

  register(listener) {
    this.listeners.pushObject(listener);

    if(this.count === 1) {
      this.iterate();
    }

    return () => {
      this.listeners.removeObject(listener);
    };
  },

  onTick() {
    this.listeners.forEach(listener => listener());
  },

  cancelIterate() {
    cancel(this.__later);
  },

  iterate() {
    if(this.count === 0 || this.suspended > 0) {
      return;
    }

    this.onTick();
    this.cancelIterate();
    this.__later = later(() => this.iterate(), 250);
  },

  suspend() {
    this.incrementProperty('suspended');
    this.cancelIterate();
    let resumed = false;
    return () => {
      if(resumed) {
        return;
      }
      resumed = true;
      this.decrementProperty('suspended');
      this.iterate();
    }
  }

});
