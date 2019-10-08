import Entity, { render } from '../../../entity';

export default Entity.extend({

  baseType: 'scene/layer/node',
  baseTypeName: 'Node',

  render: render('scene/layer/node')

});
