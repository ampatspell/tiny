import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';
import ScheduleSave from './-schedule-save';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

const size = key => computed(`size.${key}`, function() {
  let size = this.size;
  if(!size) {
    return;
  }
  let value = size[key];
  if(!value) {
    return;
  }
  let indexes = [];
  for(let i = 0; i < value; i++) {
    indexes.push(i);
  }
  return indexes;
}).readOnly();

export default EmberObject.extend(ScheduleSave, {

  path: null,

  doc: observed().owner('path').content(({ store, path }) => store.doc(path).existing()),

  isLoading: doc('isLoading'),

  size:  data('size.serialized'),
  bytes: data('bytes'),

  _columns: size('height'),
  _rows:    size('width'),

  columns: models('_columns').named('pixels/column').mapping((y, pixels) => ({ y, pixels })),

  async load() {
    await resolveObservers(this.doc);
  },

  async save() {
    await this.doc.save({ token: true });
  },

  _didUpdateBytes() {
    // zuglet has no idea bytes has changed
    this.doc.data.notifyPropertyChange('bytes');
    this.scheduleSave();
  },

  setByte(index, value) {
    let { bytes } = this;
    if(bytes[index] === value) {
      return;
    }
    bytes[index] = value;
    this._didUpdateBytes();
  }

});
