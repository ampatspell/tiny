import Service from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { array } from 'editor/utils/computed';
import { later, cancel } from '@ember/runloop';

export default Service.extend({

  listeners: array(),
  count: readOnly('listeners.length'),

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

  iterate() {
    if(this.count === 0) {
      return;
    }

    this.onTick();

    cancel(this.__later);
    this.__later = later(() => this.iterate(), 250);
  }

});
