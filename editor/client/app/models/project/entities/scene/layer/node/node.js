import Entity, { data, render } from '../../../entity';

export {
  data
}

export default Entity.extend({

  baseType: 'scene/layer/node',
  baseTypeName: 'Node',

  render: render('scene/layer/node'),

  clampPosition(position) {
    return this.parent.clampNodePosition(this, position);
  },

});
