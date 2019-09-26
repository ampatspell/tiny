import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';
import { model } from 'ember-cli-zuglet/lifecycle';
import { Pixel, toIndex } from 'editor/utils/pixel';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'sprites/sprite/frame',
  typeName: 'Frame',

  project: readOnly('frames.project'),
  sprite: readOnly('frames.sprite'),
  size: readOnly('sprite.size'),

  index: data('index'),
  identifier: data('identifier'),
  bytes: data('bytes'),

  properties: properties(),

  preview: model().named('project/sprites/sprite/frames/frame/preview').mapping(frame => ({ frame })),

  _previewRendered: readOnly('preview.rendered'),

  async load() {
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

    let { doc } = this;
    doc.set('data.bytes', target.bytes);
    return doc;
  },

});
