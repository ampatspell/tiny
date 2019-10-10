import Entity, { data, render } from '../../entity';
import { properties } from '../../../properties';

export {
  data
}

export default Entity.extend({

  baseType: 'scene/layer',
  baseTypeName: 'Layer',
  typeName: 'Layer',

  render: render('scene/layer'),
  properties: properties()

});
