import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  type: reads('model.typeName'),
  identifier: reads('model.identifier'),

  lock: true,

  actions: {
    locked(locked) {
      this.model.update({ locked });
    }
  }

});
