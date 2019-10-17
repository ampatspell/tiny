import Entity, { data, render } from '../entity';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { properties } from '../../properties';
import { model } from 'ember-cli-zuglet/lifecycle';
import { Pixel, toIndex } from 'editor/utils/pixel';

export default Entity.extend({

  typeName: 'Sprite Frame',

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

});
