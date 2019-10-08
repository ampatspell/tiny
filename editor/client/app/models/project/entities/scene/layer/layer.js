import Entity, { render } from '../../entity';

export default Entity.extend({

  baseType: 'scene/layer',
  typeName: 'Layer',

  render: render('scene/layer')

});
