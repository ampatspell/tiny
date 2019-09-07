import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';
import { array } from 'editor/utils/computed';
import { models, observed, resolveObservers } from 'ember-cli-zuglet/lifecycle';

const path = fn => observed().owner('path').content(fn);

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

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
    .mapping((doc, scene) => ({ doc, scene })),

  isLoading: or('doc.isLoading', 'nodesQuery.isLoading'),

  async load() {
    let { nodesQuery } = this;
    await resolveObservers(nodesQuery);
  },

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  async delete() {
    await this.doc.delete();
  },

  //

  async createNode(opts) {
    let doc = this.doc.ref.collection('nodes').doc().new({
      type: 'fill',
      position: {
        x: 8*8,
        y: 4*8
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
