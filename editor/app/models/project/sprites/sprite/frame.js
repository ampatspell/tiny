import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import ScheduleSave from 'editor/models/-schedule-save';
import { fromIndex, toIndex } from 'editor/utils/pixel';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);
const sprite = path => readOnly(`sprite.${path}`);

export default EmberObject.extend(ScheduleSave, {

  sprite: null,
  doc: null,

  size:  sprite('size'),
  index: data('index'),
  bytes: data('bytes'),

  preview: model().named('project/sprites/sprite/frame/preview').mapping(frame => ({ frame })),

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
    let mutated = cb(bytes);
    if(mutated === false) {
      return;
    }
    this._didUpdateBytes();
    this.scheduleSave();
  },

  setPixel(index, value) {
    this._withBytes(bytes => {
      if(bytes[index] === value) {
        return false;
      }
      bytes[index] = value;
    });
  },

  fill(value) {
    this._withBytes(bytes => bytes.fill(value));
  },

  invert() {
    this._withBytes(bytes => bytes.forEach((value, index) => {
      if(value === 0) {
        return;
      }
      bytes[index] = value === 1 ? 2 : 1;
    }));
  },

  _resize(handle, size) {
    this.cancelScheduledSave();

    let source = {
      bytes: new Uint8Array(this.bytes),
      size: this.size
    };

    let target = {
      bytes: new Uint8Array(size.width * size.height),
      size
    };

    for(let y = 0; y < source.size.height; y++) {
      for(let x = 0; x < source.size.width; x++) {
        let value = source.bytes[toIndex(x, y, source.size)];
        target.bytes[toIndex(x, y, target.size)] = value;
      }
    }

    let { doc } = this;
    doc.set('data.bytes', target.bytes);
    return doc;
  }

});
