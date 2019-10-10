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

  render: render('scene/layer'),
  properties: properties(),

  position: Object.freeze({ x: 0, y: 0 }),
  size: readOnly('parent.size'),

  nodes: model().named('project/entities/scene/layer/nodes').mapping(model => ({ model })),

});
