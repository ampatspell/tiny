import EmberObject, { computed } from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';
import { model } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';

export {
  data
}

export default EmberObject.extend(DocMixin, {

  isNode: true,

  typeGroup: 'scenes/scene/layer/node',
  typeName: 'Node',
  baseTypeName: 'Node',

  project: readOnly('nodes.project'),
  layer: readOnly('nodes.layer'),
  scene: readOnly('layer.scene'),

  nodes: null,

  type: data('type'),
  index: data('index'),
  identifier: data('identifier'),
  position: data('position.serialized'),

  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('nodes.chainHidden', 'hidden'),
  chainLocked: or('nodes.chainLocked', 'locked'),

  properties: properties(),

  render: model().named('project/scenes/scene/layers/layer/nodes/node/render').mapping(model => ({ model })),

  //

  selections: computed('scene', function() {
    let { scene } = this;
    return [ this, scene ];
  }).readOnly(),

  //

  async load() {
  },

  async moveUp() {
    await this.nodes.moveUp(this);
  },

  async moveDown() {
    await this.nodes.moveDown(this);
  },

  //

  select() {
    this.project.select(this);
  },

  selectParent() {
    this.layer.select();
  },

  //

  // TODO: node clamp to scene
  // clampPosition(position) {
  //   let { size, scene: { size: scene } } = this;

  //   let clamp = (p, s) => Math.max(0, Math.min(position[p], scene[s] - size[s]));
  //   let x = clamp('x', 'width');
  //   let y = clamp('y', 'height');

  //   return this.layer.clampNodePosition(this, { x, y });
  // },

  onParentResized(id, diff) {
    if(id === 'left' || id === 'top') {
      let position = assign({}, this.position);
      let calc = key => position[key] += diff[key];
      calc('x');
      calc('y');
      this.update({ position });
    }
  },

  async willDelete() {
    await this.nodes.onWillDeleteNode(this);
  }

});
