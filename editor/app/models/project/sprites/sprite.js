import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';
import { array } from 'editor/utils/computed';
import gif from 'editor/utils/gif';

const path = fn => observed().owner('path').content(fn);

const doc = key => readOnly(`doc.${key}`);
const data = key => doc(`data.${key}`);

export default EmberObject.extend({

  sprites: null,
  doc: null,
  id: doc('id'),
  path: doc('path'),

  name: data('name'),
  identifier: data('identifier'),
  thumbnail: data('thumbnail'),

  _adding: array(),

  framesQuery: path(({ store, path, _adding }) => store.collection(`${path}/frames`).orderBy('index').query({
    doc: path => _adding.findBy('path', path)
  })),

  frames: models('framesQuery.content').named('project/sprites/sprite/frame').mapping((doc, sprite) => ({ doc, sprite })),

  isLoading: or('doc.isLoading', 'framesQuery.isLoading'),

  size: readOnly('doc.data.size.serialized'),

  async load() {
    let { framesQuery } = this;
    await resolveObservers(framesQuery);
  },

  async resize(handle, diff) {
    if(diff.x === 0 && diff.y === 0) {
      return false;
    }

    let { size } = this;

    let target = {
      width: size.width + diff.x,
      height: size.height + diff.y
    };

    if(target.width < 1 || target.height < 1) {
      return false;
    }

    let { doc } = this;

    await this.store.batch(batch => {
      this.frames.forEach(frame => {
        let doc = frame._resize(handle, target);
        batch.save(doc);
      });

      doc.set('data.size', target)
      batch.save(doc);
    });

    return true;
  },

  async reindexFrames(hole) {
    await this.store.batch(batch => {
      let delta = 0;
      this.frames.forEach((frame, idx) => {
        let { doc } = frame;
        if(idx === hole) {
          delta = 1;
        }
        doc.set('data.index', idx + delta);
        batch.save(doc);
      });
    });
  },

  async createFrame(opts) {
    let { index, bytes } = assign({ index: 0 }, opts);
    if(bytes) {
      bytes = bytes.slice();
    } else {
      let { size } = this;
      bytes = new Uint8Array(size.width * size.height);
    }

    let doc = this.doc.ref.collection('frames').doc().new({
      index,
      bytes
    });

    try {
      this._adding.pushObject(doc);
      await doc.save();
      return this.frames.findBy('doc', doc);
    } finally {
      this._adding.removeObject(doc);
    }
  },

  async duplicateFrame(frame) {
    let { index, bytes } = frame;
    index = index + 1;
    await this.reindexFrames(index);
    return await this.createFrame({ index, bytes });
  },

  //

  createThumbnailBlob() {
    let { frames } = this;
    if(frames.length === 0) {
      return;
    }
    return gif(gif => {
      frames.map(frame => {
        let canvas = frame.preview.opaque;
        gif.addFrame(canvas, { delay: 200 });
      });
    });
  },

  async createThumbnail() {
    let { store, doc } = this;

    let blob = await this.createThumbnailBlob();
    let url = null;

    if(blob) {
      let ref = store.storage.ref(`${doc.ref.path}/thumbnail.gif`);
      await ref.put({
        type: 'data',
        data: blob,
        metadata: {
          contentType: 'image/gif'
        }
      });

      let { value } = await ref.url.load();
      url = value;
    }

    doc.data.setProperties({ thumbnail: url });

    await doc.save();
  },

  //

  toStringExtension() {
    let { id, identifier } = this;
    return `${id}:${identifier}`;
  }

});
