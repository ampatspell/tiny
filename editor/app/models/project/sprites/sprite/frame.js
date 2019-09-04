import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { models, model } from 'ember-cli-zuglet/lifecycle';
import ScheduleSave from 'editor/models/-schedule-save';

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

  columns: models('_columns').named('project/sprites/sprite/frame/column').mapping((y, pixels) => ({ y, pixels })),

  preview: model().named('project/sprites/sprite/frame/preview').mapping(frame => ({ frame })),

  async save() {
    await this.doc.save({ token: true });
  },

  _didUpdateBytes(notify) {
    if(notify) {
      this.notifyPropertyChange('bytes');
    }
    this.preview.create();
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
      this._didUpdateBytes(false);
    });
  },

  fill(value) {
    this._withBytes(bytes => bytes.fill(value));
    this._didUpdateBytes(true);
  },

  invert() {
    this._withBytes(bytes => bytes.forEach((value, index) => {
      if(value === 0) {
        return;
      }
      bytes[index] = value === 1 ? 2 : 1;
    }));
    this._didUpdateBytes(true);
  },

  pixelAt(x, y) {
    let col = this.columns.objectAt(y);
    return col && col.rows.objectAt(x);
  }

});
