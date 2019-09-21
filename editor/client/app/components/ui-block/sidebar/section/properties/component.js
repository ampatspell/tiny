import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly, or, not } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':properties' ],

  properties: readOnly('value.array'),

  key: null,

  duplicate: computed('key', 'properties', function() {
    let { key, properties } = this;
    return properties.find(prop => prop.key === key);
  }).readOnly(),

  empty: not('key'),

  addDisabled: or('disabled', 'empty', 'duplicate'),

  actions: {
    key(key) {
      this.setProperties({ key });
    },
    add() {
      this.add();
    },
    update(item, value, focus) {
      if(focus === false) {
        return;
      }
      this.value.update(item.key, value);
    },
    delete(item) {
      this.value.delete(item.key);
    }
  },

  add() {
    this.value.update(this.key, null);
    this.setProperties({ key: null });
  }

});
