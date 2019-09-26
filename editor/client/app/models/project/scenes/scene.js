import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';
import { frame, pixelFrame, pixelSize } from '../../-frame';
import { selected, selectedChild } from '../-selection';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'scenes/scene',
  typeName: 'Scene',

  project: readOnly('scenes.project'),

  scenes: null,
  doc: null,

  index: data('index'),
  identifier: data('identifier'),
  position: data('position.serialized'),
  size: data('size.serialized'),
  background: data('background'),

  collapsed: data('collapsed'),
  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('scenes.chainHidden', 'hidden'),
  chainLocked: or('scenes.chainLocked', 'locked'),

  properties: properties(),

  layers: model().named('project/scenes/scene/layers').mapping(scene => ({ scene })),

  //

  absolutePixel: readOnly('project.pixel'),

  frame: frame(),
  pixelFrame: pixelFrame('project.pixel'),
  pixelSize: pixelSize('project.pixel'),

  selected: selected(),
  selectedChild: selectedChild('scene'),
  selectedNode: selectedChild('scene', 'isNode'),
  selectedLayer: selectedChild('scene', 'isLayer'),

  //

  async load({ type }) {
    if(type === 'detail') {
      await this.layers.load({ type });
    }
  },

  willDelete() {
    this.project.selectIf(this, this.scenes);
  },

  async moveUp() {
    await this.scenes.moveUp(this);
  },

  async moveDown() {
    await this.scenes.moveDown(this);
  },

});
