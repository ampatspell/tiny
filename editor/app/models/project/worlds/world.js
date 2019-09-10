import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';
import { array } from 'editor/utils/computed';
import { all } from 'rsvp';

const path = fn => observed().owner('path').content(fn);

const doc = key => readOnly(`doc.${key}`);
const data = key => doc(`data.${key}`);

export default EmberObject.extend({

  worlds: null,
  doc: null,
  id: doc('id'),
  path: doc('path'),

  name: data('name'),
  locked: data('locked'),
  // thumbnail: data('thumbnail'),

  _adding: array(),

  scenesQuery: path(({ store, path, _adding }) => store.collection(`${path}/scenes`).orderBy('index', 'asc').query({
    doc: path => _adding.findBy('path', path)
  })),

  scenes: models('scenesQuery.content').named('project/worlds/world/scene').mapping((doc, world) => ({ doc, world })),

  isLoading: or('doc.isLoading', 'scenesQuery.isLoading'),

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.save();
  },

  async load() {
    setGlobal({ world: this });
    await resolveObservers(this.scenesQuery);
    await all(this.scenes.map(scene => scene.load()));
  },

  //

  async createScene(opts) {
    let last = this.scenes.lastObject;
    let index = 0;
    if(last) {
      index = last.index + 1;
    }

    let {
      name,
      identifier,
      position,
      size,
      grid
    } = assign({
      name: null,
      identifier: null,
      position: { x: 4, y: 6 },
      size: { width: 128, height: 64 }
    }, opts);

    let doc = this.doc.ref.collection('scenes').doc().new({
      index,
      name,
      identifier,
      position,
      size,
      grid,
      background: 'white'
    });

    try {
      this._adding.pushObject(doc);
      await doc.save();
      return this.scenes.findBy('doc', doc);
    } finally {
      this._adding.removeObject(doc);
    }
  },

  //

  async createThumbnail() {
  },

  async delete() {
    await this.doc.delete();
  },

  //

  toStringExtension() {
    let { id } = this;
    return `${id}`;
  }

});
