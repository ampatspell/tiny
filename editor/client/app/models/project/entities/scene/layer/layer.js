import Entity, { data, render } from '../../entity';
import { properties } from '../../../properties';
import { model } from 'ember-cli-zuglet/lifecycle';

export {
  data
}

export default Entity.extend({

  baseType: 'scene/layer',
  baseTypeName: 'Layer',
  typeName: 'Layer',

  render: render('scene/layer'),
  properties: properties(),

  nodes: model().named('project/entities/scene/layer/nodes').mapping(model => ({ model })),

});
