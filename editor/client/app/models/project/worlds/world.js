import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import { imageURLToBlob } from 'editor/utils/canvas';

const doc = key => readOnly(`doc.${key}`);
const data = key => doc(`data.${key}`);

export default EmberObject.extend({

  worlds: null,
  doc: null,
  id: doc('id'),
  path: doc('path'),

  name: data('name'),
  locked: data('locked'),
  thumbnail: data('thumbnail'),

  scenes: model().named('project/worlds/world/scenes').mapping(world => ({ world })),

  //

  async load() {
    await this.scenes.load();
  },

  async save() {
    await this.doc.save({ token: true });
  },

  async delete() {
    this.skipCreateThumbnail = true;
    await this.doc.delete();
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.save();
  },

  //

  async createThumbnailFromDataURL(dataURL) {
    if(this.skipCreateThumbnail) {
      return;
    }

    let { store, doc } = this;

    let blob = await imageURLToBlob(dataURL);
    let url = null;

    if(blob) {
      let ref = store.storage.ref(`${doc.ref.path}/thumbnail.png`);
      await ref.put({
        type: 'data',
        data: blob,
        metadata: {
          contentType: 'image/png'
        }
      });

      let { value } = await ref.url.load();
      url = value;
    }

    doc.data.setProperties({ thumbnail: url });

    await this.save();
  }

});
