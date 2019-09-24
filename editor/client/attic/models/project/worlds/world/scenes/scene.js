import EmberObject, { computed } from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';
import { model } from 'ember-cli-zuglet/lifecycle';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  isScene: true,

  scenes: null,
  world: readOnly('scenes.world'),

  doc: null,
  id: doc('id'),
  path: doc('path'),
  ref: doc('ref'),

  index: data('index'),
  name: data('name'),
  identifier: data('identifier'),
  size: data('size.serialized'),
  background: data('background'),
  position: data('position.serialized'),
  collapsed: data('collapsed'),

  locked: data('locked'),
  chainLocked: or('locked', 'world.locked'),
  hidden: data('hidden'),
  chainHidden: readOnly('hidden'),

  frame: computed('size', function() {
    let { size } = this;
    return { x: 0, y: 0, ...size };
  }).readOnly(),

  properties: model().named('project/properties').mapping(owner => ({ owner })),
  layers: model().named('project/worlds/world/scenes/scene/layers').mapping(scene => ({ scene })),

  //

  async load() {
    await this.layers.load();
  },

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  async moveUp() {
    await this.scenes.moveUp(this);
  },

  async moveDown() {
    await this.scenes.moveDown(this);
  },

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  },

  //

  clampPosition(position) {
    return position;
  }

});
