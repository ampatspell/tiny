import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';
import { array } from 'editor/utils/computed';
import { models, observed, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';

const path = fn => observed().owner('path').content(fn);

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  isScene: true,

  world: null,
  doc: null,
  id: doc('id'),
  path: doc('path'),

  name: data('name'),
  identifier: data('identifier'),
  size: data('size.serialized'),
  grid: data('grid.serialized'),
  background: data('background'),
  position: data('position.serialized'),

  locked: data('locked'),
  chainLocked: or('locked', 'world.locked'),
  hidden: data('hidden'),
  chainHidden: readOnly('hidden'),

  _adding: array(),

  layersQuery: path(({ store, path, _adding }) => store.collection(`${path}/layers`).query({
    doc: path => _adding.findBy('path', path)
  })),

  layers: models('layersQuery.content')
    .object('data.type')
    .named(doc => {
      let type = doc.get('data.type');
      return `project/worlds/world/scene/layer/${type}`;
    })
    .mapping((doc, scene) => ({ doc, scene })),

  isLoading: or('doc.isLoading', 'layersQuery.isLoading'),

  async load() {
    let { layersQuery } = this;
    await resolveObservers(layersQuery);
    await all(this.layers.map(layer => layer.load()));
  },

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  },

  //

  async createLayer(opts) {
    let { index } = assign({ index: 0 }, opts);
    let doc = this.doc.ref.collection('layers').doc().new({
      type: 'grid',
      index
    });

    try {
      this._adding.pushObject(doc);
      await doc.save();
      return this.layers.findBy('doc', doc);
    } finally {
      this._adding.removeObject(doc);
    }
  },

  //

  clampPosition(position) {
    return position;
  },

});
