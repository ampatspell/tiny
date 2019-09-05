import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';

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

  framesQuery: path(({ store, path }) => store.collection(`${path}/frames`).orderBy('index').query()),
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

      doc.set('data.size', target);
      batch.save(this.doc);
    });

    return true;
  },

  toStringExtension() {
    let { id, identifier } = this;
    return `${id}:${identifier}`;
  }

});
