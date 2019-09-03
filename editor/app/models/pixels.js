import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';
import ScheduleSave from './-schedule-save';

export const Pixel = {
  transparent: 0,
  white: 1,
  black: 2
};

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
    this.notifyPropertyChange('bytes');
  },

  _withBytes(cb) {
    let { bytes } = this;
    if(!bytes) {
      return;
    }
    cb(bytes);
    this.scheduleSave();
  },

  setByte(x, y, value) {
    let pixel = this.pixelAt(x, y);
    let index = pixel.index;
    this._withBytes(bytes => {
      if(bytes[index] === value) {
        return;
      }
      bytes[index] = value;
      pixel.didUpdate();
    });
  },

  fill(value) {
    this._withBytes(bytes => bytes.fill(value));
    this._didUpdateBytes();
  },

  invert() {
    this._withBytes(bytes => bytes.forEach((value, index) => {
      if(value === 0) {
        return;
      }
      bytes[index] = value === 1 ? 2 : 1;
    }));
    this._didUpdateBytes();
  },

  pixelAt(x, y) {
    let col = this.columns.objectAt(y);
    return col && col.rows.objectAt(x);
  }

});
