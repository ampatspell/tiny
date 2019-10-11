import Entity, { data, render } from '../../entity';
import { properties } from '../../../properties';
import { model } from 'ember-cli-zuglet/lifecycle';
import { readOnly } from '@ember/object/computed';

export {
  data
}

export default Entity.extend({

  baseType: 'scene/layer',
  baseTypeName: 'Layer',
  typeName: 'Layer',

  scene: readOnly('parent'),

  render: render('scene/layer'),
  properties: properties(),

  position: Object.freeze({ x: 0, y: 0 }),
  size: readOnly('scene.size'),

  nodes: model().named('project/entities/scene/layer/nodes').mapping(model => ({ model })),

  clampNodePosition(node, position) {
    let { size: layer } = this;
    let { size } = node;

    let calc = (p, s) => Math.min(Math.max(position[p], 0), layer[s] - size[s]);

    let x = calc('x', 'width');
    let y = calc('y', 'height');

    return { x, y };
  },

});
