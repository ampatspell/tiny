import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  owner: null,
  doc: readOnly('owner.doc'),
  object: readOnly('doc.data.properties'),
  serialized: readOnly('object.serialized'),

  array: computed('serialized', function() {
    let { serialized } = this;
    return Object.keys(serialized || {}).reduce((arr, key) => {
      let value = serialized[key];
      arr.push({ key, value });
      return arr;
    }, []);
  }).readOnly(),

  properties() {
    let object = this.object;
    if(!object) {
      this.doc.data.set('properties', {});
      object = this.object;
    }
    return object;
  },

  update(key, value) {
    if(value === undefined) {
      value = null;
    }
    let properties = this.properties();
    properties.set(key, value);
    this.scheduleSave();
  },

  delete(key) {
    let properties = this.properties();
    properties.set(key, undefined);
  },

  scheduleSave() {
    this.owner.scheduleSave();
  }

});
