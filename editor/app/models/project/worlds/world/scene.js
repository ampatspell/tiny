import EmberObject, { computed } from '@ember/object';
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

  index: data('index'),
  name: data('name'),
  identifier: data('identifier'),
  size: data('size.serialized'),
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

  orderedLayers: computed('layers.@each.index', function() {
    return this.layers.sortBy('index');
  }).readOnly(),

  layersReversed: computed('orderedLayers', function() {
    return this.orderedLayers.slice().reverse();
  }).readOnly(),

  isLoading: or('doc.isLoading', 'layersQuery.isLoading'),

  frame: computed('size', function() {
    let { size } = this;
    return { x: 0, y: 0, ...size };
  }).readOnly(),

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
    let last = this.layers.lastObject;
    let index = 0;
    if(last) {
      index = last.index + 1;
    }

    opts = assign({}, opts, { index });
    let doc = this.doc.ref.collection('layers').doc().new(opts);

    try {
      this._adding.pushObject(doc);
      await doc.save();
      return this.layers.findBy('doc', doc);
    } finally {
      this._adding.removeObject(doc);
    }
  },

  //

  async _moveLayerDelta(layer, delta) {
    let { orderedLayers } = this;
    let idx = orderedLayers.indexOf(layer);
    if(idx === -1) {
      return;
    }

    idx = idx + delta;
    if(idx < 0 || idx > orderedLayers.length - 1) {
      return;
    }

    let next = orderedLayers.objectAt(idx);
    if(!next) {
      return;
    }

    let { index } = layer;

    layer.doc.data.setProperties({ index: next.index });
    next.doc.data.setProperties({ index });

    await this.store.batch(batch => {
      batch.save(layer.doc);
      batch.save(next.doc);
    });
  },

  async moveLayerUp(layer) {
    await this._moveLayerDelta(layer, +1);
  },

  async moveLayerDown(layer) {
    await this._moveLayerDelta(layer, -1);
  },

  //

  clampPosition(position) {
    return position;
  },

});
