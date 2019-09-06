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

  worlds: null,
  doc: null,
  id: doc('id'),
  path: doc('path'),

  name: data('name'),
  thumbnail: data('thumbnail'),
  locked: data('locked'),

  isLoading: or('doc.isLoading'),
  size: readOnly('doc.data.size.serialized'),

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.save();
  },

  async load() {
    let { framesQuery } = this;
    await resolveObservers(framesQuery);
  },

  async createThumbnail() {
  },

  //

  toStringExtension() {
    let { id } = this;
    return `${id}`;
  }

});
