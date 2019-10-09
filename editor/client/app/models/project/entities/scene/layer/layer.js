import Entity, { render } from '../../entity';
import { properties } from '../../../properties';

export default Entity.extend({

  baseType: 'scene/layer',
  baseTypeName: 'Layer',
  typeName: 'Layer',

  render: render('scene/layer'),
  properties: properties(),

});
