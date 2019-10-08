import Entity, { render } from '../../entity';

export default Entity.extend({

  baseType: 'scene/layer',
  baseTypeName: 'Layer',
  typeName: 'Layer',

  render: render('scene/layer')

});
