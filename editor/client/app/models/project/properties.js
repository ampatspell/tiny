import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';

export const properties = () => model().named('project/properties').mapping(model => ({ model }));

export default EmberObject.extend({

  model: null,
  doc: readOnly('model.doc'),
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
    this.model.scheduleSave();
  }

});
