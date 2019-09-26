import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';
import { selected, selectedChild } from '../-selection';
import { assign } from '@ember/polyfills';

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
  render: model().named('project/scenes/scene/render').mapping(model => ({ model })),

  //

  isSelected: selected(),
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

  select(parent=false) {
    if(parent && this.selectedChild) {
      this.selectedChild.selectParent();
      return;
    }
    this.project.select(this);
  },

  onResize(id, diff) {
    let size = assign({}, this.size);
    size.width += diff.x;
    size.height += diff.y;
    this.update({ size });
  }

});
