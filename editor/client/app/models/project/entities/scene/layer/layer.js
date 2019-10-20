import Entity, { data, render } from '../../entity';
import { model } from 'ember-cli-zuglet/lifecycle';
import { readOnly } from '@ember/object/computed';
import { selectedChildEntity } from '../../../-selection';

export {
  data
}

export default Entity.extend({

  baseType: 'scene/layer',
  baseTypeName: 'Layer',
  typeName: 'Layer',

  scene: readOnly('parent'),
  container: readOnly('scene'),

  render: render('scene/layer'),

  position: Object.freeze({ x: 0, y: 0 }),
  size: readOnly('scene.size'),

  selectedNode: selectedChildEntity('layer'),

  nodes: model().named('project/entities/scene/layer/nodes').mapping(model => ({ model })),

  clampNodePosition(node, position) {
    let { size: layer } = this;
    let { size } = node;

    let calc = (p, s) => Math.min(Math.max(position[p], 0), layer[s] - size[s]);

    let x = calc('x', 'width');
    let y = calc('y', 'height');

    return { x, y };
  },

  onParentResized(id, diff) {
    this.nodes.onParentResized(id, diff);
  },

  async didCreateNode(node) {
    await this.scene.didCreateNode(node);
  },

  async willDeleteNode(node) {
    await this.scene.willDeleteNode(node);
  },

  //

  async willDelete() {
    await this.scene.willDeleteLayer(this);
  }

});
