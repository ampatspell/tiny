import Entity, { data, render } from '../../../entity';
import { readOnly } from '@ember/object/computed';
import { isSelected } from '../../../../-selection';

export {
  data
}

export default Entity.extend({

  baseType: 'scene/layer/node',
  baseTypeName: 'Node',

  layer: readOnly('parent'),
  scene: readOnly('layer.scene'),

  render: render('scene/layer/node'),

  isSelected: isSelected(),

  clampPosition(position) {
    return this.parent.clampNodePosition(this, position);
  },

});
