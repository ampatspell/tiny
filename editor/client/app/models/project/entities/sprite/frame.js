import Entity, { data, render } from '../entity';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { properties } from '../../properties';
import { model } from 'ember-cli-zuglet/lifecycle';
import { Pixel, toIndex } from 'editor/utils/pixel';

export default Entity.extend({

  typeName: 'Sprite Frame',

  sprite: readOnly('parent'),
  size: readOnly('parent.size'),

  bytes: data('bytes'),

  properties: properties(),
  preview: model().named('project/entities/sprite/frame/preview').mapping(frame => ({ frame })),

  previewRendered: readOnly('preview.rendered'),

  render: render('sprite/frame'),

  description: computed('index', 'identifier', function() {
    let { index, identifier } = this;
    let arr = [];
    arr.push(`#${index}`);
    if(identifier) {
      arr.push('/', identifier);
    }
    return arr.join(' ');
  }).readOnly(),

  resize(handle, size) {
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
        if(handle === 'right' || handle === 'bottom') {
          target.bytes[toIndex(x, y, target.size)] = value;
        } else if(handle === 'top') {
          let d = target.size.height - source.size.height;
          let ty = y + d;
          target.bytes[toIndex(x, ty, target.size)] = value;
        } else if(handle === 'left') {
          let d = target.size.width - source.size.width;
          let tx = x + d;
          if(tx >= 0) {
            target.bytes[toIndex(tx, y, target.size)] = value;
          }
        }
      }
    }

    this.update({ bytes: target.bytes });
  },

  _didUpdateBytes() {
    this.notifyPropertyChange('bytes');
    this.scheduleSave();
  },

  _replaceBytes(bytes) {
    this.doc.set('data.bytes', bytes);
    this._didUpdateBytes();
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

  //

  _select(bytes, frame) {
    let { size } = this;
    let cols = [];
    for(let y = frame.y; y < frame.y + frame.height; y++) {
      let row = [];
      cols.push(row);
      for(let x = frame.x; x < frame.x + frame.width; x++) {
        let index = toIndex(x, y, size);
        row.push(bytes[index]);
      }
    }
    return cols;
  },

  _clear(bytes, frame) {
    let { size } = this;
    for(let y = frame.y; y < frame.y + frame.height; y++) {
      for(let x = frame.x; x < frame.x + frame.width; x++) {
        let index = toIndex(x, y, size);
        bytes[index] = Pixel.transparent;
      }
    }
  },

  _write(bytes, target, selection) {
    let { size } = this;
    for(let y = 0; y < selection.length; y++) {
      let ty = target.y + y;
      if(ty < 0 || ty > size.height - 1) {
        continue;
      }
      let row = selection[y];
      for(let x = 0; x < row.length; x++) {
        let tx = target.x + x;
        if(tx < 0 || tx > size.width - 1) {
          continue;
        }
        let value = row[x];
        if(value === Pixel.transparent) {
          continue;
        }
        let index = toIndex(tx, ty, size);
        bytes[index] = value;
      }
    }
  },

  beginMove(source) {
    let pristine = this.bytes.slice();
    let selection = this._select(pristine, source);
    return target => {
      let bytes = pristine.slice();
      this._clear(bytes, source);
      this._write(bytes, target, selection);
      this._replaceBytes(bytes);
    }
  },

  async willDelete() {
    await this.sprite.willDeleteFrame(this);
    this._sprite = this.sprite;
  },

  async didDelete() {
    await this._sprite.didDeleteFrame(this);
  }

});
