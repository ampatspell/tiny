import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);
const layer = path => readOnly(`layer.${path}`);

export default EmberObject.extend(ScheduleSave, {

  isNode: true,

  doc: null,
  layer: null,
  parent: readOnly('layer'),
  scene: layer('scene'),
  world: layer('world'),

  id: doc('id'),

  type: data('type'),
  position: data('position.serialized'),
  size: data('size.serialized'),

  locked: data('locked'),
  chainLocked: or('locked', 'layer.chainLocked'),
  hidden: data('hidden'),
  chainHidden: or('hidden', 'layer.chainHidden'),

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  async load() {
  },

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  },

  //

  clampPosition(position) {
    let { size, scene: { size: scene } } = this;

    let clamp = (p, s) => Math.max(0, Math.min(position[p], scene[s] - size[s]));
    let x = clamp('x', 'width');
    let y = clamp('y', 'height');

    return this.layer.clampNodePosition(this, { x, y });
  }

});
