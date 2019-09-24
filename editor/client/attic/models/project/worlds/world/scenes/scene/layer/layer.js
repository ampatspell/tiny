import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import ScheduleSave from 'editor/models/-schedule-save';

const scene = path => readOnly(`scene.${path}`);
const doc = path => readOnly(`doc.${path}`);
export const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  isLayer: true,

  doc: null,
  layers: null,

  scene: readOnly('layers.scene'),
  parent: readOnly('scene'),
  world: scene('world'),

  id: doc('id'),
  path: doc('path'),
  ref: doc('ref'),

  type: data('type'),
  index: data('index'),
  identifier: data('identifier'),
  collapsed: data('collapsed'),

  locked: data('locked'),
  chainLocked: or('locked', 'scene.locked'),
  hidden: data('hidden'),
  chainHidden: or('hidden', 'scene.hidden'),

  frame: readOnly('scene.frame'),

  properties: model().named('project/properties').mapping(owner => ({ owner })),
  nodes: model().named('project/worlds/world/scenes/scene/layer/nodes').mapping(layer => ({ layer })),

  async load() {
    await this.nodes.load();
  },

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  //

  async moveUp() {
    await this.scene.layers.moveUp(this);
  },

  async moveDown() {
    await this.scene.layers.moveDown(this);
  },

  //

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  }

});
