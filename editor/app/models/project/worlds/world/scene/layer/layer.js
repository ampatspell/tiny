import EmberObject, { computed } from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { models, observed, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { array } from 'editor/utils/computed';
import { all } from 'rsvp';
import { assign } from '@ember/polyfills';
import ScheduleSave from 'editor/models/-schedule-save';

const path = fn => observed().owner('path').content(fn);

const scene = path => readOnly(`scene.${path}`);

const doc = path => readOnly(`doc.${path}`);
export const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  isLayer: true,

  doc: null,
  scene: null,
  parent: readOnly('scene'),
  world: scene('world'),

  id: doc('id'),
  path: doc('path'),

  type: data('type'),
  index: data('index'),

  locked: data('locked'),
  chainLocked: or('locked', 'scene.locked'),
  hidden: data('hidden'),
  chainHidden: or('hidden', 'scene.hidden'),

  _adding: array(),

  frame: readOnly('scene.frame'),

  nodesQuery: path(({ store, path, _adding }) => store.collection(`${path}/nodes`).query({
    doc: path => _adding.findBy('path', path)
  })),

  nodes: models('nodesQuery.content')
    .object('data.type')
    .named(doc => {
      let type = doc.get('data.type');
      return `project/worlds/world/scene/node/${type}`;
    })
    .mapping((doc, layer) => ({ doc, layer })),

  orderedNodes: computed('nodes.@each.index', function() {
    return this.nodes.sortBy('index');
  }).readOnly(),

  nodesReversed: computed('orderedNodes.@each.index', function() {
    return this.orderedNodes.slice().reverse();
  }).readOnly(),

  isLoading: or('doc.isLoading', 'nodesQuery.isLoading'),

  async load() {
    await resolveObservers(this.nodesQuery);
    await all(this.nodes.map(node => node.load()));
  },

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  async createNode(opts) {
    let last = this.orderedNodes.lastObject;
    let index = 0;
    if(last) {
      index = last.index + 1;
    }

    opts = assign({}, opts, { index });
    let doc = this.doc.ref.collection('nodes').doc().new(opts);

    try {
      this._adding.pushObject(doc);
      await doc.save();
      return this.nodes.findBy('doc', doc);
    } finally {
      this._adding.removeObject(doc);
    }
  },

  //

  async _moveNodeDelta(node, delta) {
    let { orderedNodes } = this;
    let idx = orderedNodes.indexOf(node);
    if(idx === -1) {
      return;
    }

    idx = idx + delta;
    if(idx < 0 || idx > orderedNodes.length - 1) {
      return;
    }

    let next = orderedNodes.objectAt(idx);
    if(!next) {
      return;
    }

    let { index } = node;

    node.doc.data.setProperties({ index: next.index });
    next.doc.data.setProperties({ index });

    await this.store.batch(batch => {
      batch.save(node.doc);
      batch.save(next.doc);
    });
  },

  async moveNodeUp(node) {
    await this._moveNodeDelta(node, +1);
  },

  async moveNodeDown(node) {
    await this._moveNodeDelta(node, -1);
  },

  //

  async moveUp() {
    await this.scene.moveLayerUp(this);
  },

  async moveDown() {
    await this.scene.moveLayerDown(this);
  },

  //

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  }

});
