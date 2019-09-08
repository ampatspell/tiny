import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);
const layer = path => readOnly(`layer.${path}`);

export default EmberObject.extend({

  isNode: true,

  doc: null,
  layer: null,
  scene: layer('scene'),
  world: layer('world'),

  id: doc('id'),

  type: data('type'),
  position: data('position.serialized'),
  size: data('size.serialized'),

  async load() {
  },

  async delete() {
    await this.doc.delete();
  }

});
