import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { models } from 'ember-cli-zuglet/lifecycle';
import ScheduleSave from '../-schedule-save';

export const Pixel = {
  transparent: 0,
  white: 1,
  black: 2
};

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);
const sprite = path => readOnly(`sprite.${path}`);

export default EmberObject.extend(ScheduleSave, {

  sprite: null,
  doc: null,

  size: sprite('size'),
  _columns: sprite('_columns'),
  _rows:    sprite('_rows'),

  index: data('index'),
  bytes: data('bytes'),

  columns: models('_columns').named('sprite/frame/column').mapping((y, pixels) => ({ y, pixels })),

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

  setPixel(pixel, value) {
    let index = pixel.index;
    this._withBytes(bytes => {
      if(bytes[index] === value) {
        return;
      }
      bytes[index] = value;
      pixel._didUpdate();
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
