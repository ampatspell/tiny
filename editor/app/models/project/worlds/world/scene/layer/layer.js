import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';
import { models, observed, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { array } from 'editor/utils/computed';
import { all } from 'rsvp';

const path = fn => observed().owner('path').content(fn);

const scene = path => readOnly(`scene.${path}`);

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  isLayer: true,

  doc: null,
  scene: null,
  world: scene('world'),

  id: doc('id'),
  path: doc('path'),

  type: data('type'),
  index: data('index'),

  _adding: array(),

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

  isLoading: or('doc.isLoading', 'nodesQuery.isLoading'),

  async load() {
    await resolveObservers(this.nodesQuery);
    await all(this.nodes.map(node => node.load()));
  },

  async createNode(opts) {
    let doc = this.doc.ref.collection('nodes').doc().new({
      type: 'fill',
      position: {
        x: 3,
        y: 3,
      },
      size: {
        width: 8,
        height: 8
      },
      color: 'black'
    });

    try {
      this._adding.pushObject(doc);
      await doc.save();
      return this.nodes.findBy('doc', doc);
    } finally {
      this._adding.removeObject(doc);
    }
  },

});
