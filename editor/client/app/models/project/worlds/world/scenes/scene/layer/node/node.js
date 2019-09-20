import EmberObject, { computed } from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);
const layer = path => readOnly(`layer.${path}`);

export default EmberObject.extend(ScheduleSave, {

  isNode: true,

  nodes: null,
  doc: null,

  layer: readOnly('nodes.layer'),
  parent: readOnly('layer'),
  scene: layer('scene'),
  world: layer('world'),

  id: doc('id'),

  type: data('type'),
  index: data('index'),
  identifier: data('identifier'),
  position: data('position.serialized'),
  size: data('size.serialized'),
  properties: data('properties.serialized'),

  locked: data('locked'),
  chainLocked: or('locked', 'layer.chainLocked'),
  hidden: data('hidden'),
  chainHidden: or('hidden', 'layer.chainHidden'),

  frame: computed('layer.frame', 'position', 'size', function() {
    let { layer: { frame }, position, size } = this;
    return {
      x: frame.x + position.x,
      y: frame.y + position.y,
      width: size.width,
      height: size.height
    };
  }).readOnly(),

  //

  async load() {
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

  clampPosition(position) {
    let { size, scene: { size: scene } } = this;

    let clamp = (p, s) => Math.max(0, Math.min(position[p], scene[s] - size[s]));
    let x = clamp('x', 'width');
    let y = clamp('y', 'height');

    return this.layer.clampNodePosition(this, { x, y });
  },

  //

  async moveUp() {
    await this.nodes.moveUp(this);
  },

  async moveDown() {
    await this.nodes.moveDown(this);
  }

});
