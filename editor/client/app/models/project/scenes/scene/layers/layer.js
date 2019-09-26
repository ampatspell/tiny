import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';

export {
  data
}

export default EmberObject.extend(DocMixin, {

  isLayer: true,

  typeGroup: 'scenes/scene/layer',
  typeName: 'Layer',

  project: readOnly('layers.project'),
  scene: readOnly('layers.scene'),

  layers: null,
  doc: null,

  type: data('type'),
  index: data('index'),
  identifier: data('identifier'),

  collapsed: data('collapsed'),
  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('layers.chainHidden', 'hidden'),
  chainLocked: or('layers.chainLocked', 'locked'),

  properties: properties(),

  nodes: model().named('project/scenes/scene/layers/layer/nodes').mapping(layer => ({ layer })),

  async load({ type }) {
    if(type === 'detail') {
      await this.nodes.load({ type });
    }
  },

  willDelete() {
    this.project.selectIf(this, this.layers.scene);
  },

  async moveUp() {
    await this.layers.moveUp(this);
  },

  async moveDown() {
    await this.layers.moveDown(this);
  },


});
