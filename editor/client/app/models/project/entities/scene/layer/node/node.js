import Entity, { data, render } from '../../../entity';
import { readOnly } from '@ember/object/computed';
import { assign } from '@ember/polyfills';

export {
  data
}

export default Entity.extend({

  baseType: 'scene/layer/node',
  baseTypeName: 'Node',

  layer: readOnly('parent'),
  scene: readOnly('layer.scene'),

  render: render('scene/layer/node'),

  clampPosition(position) {
    return this.parent.clampNodePosition(this, position);
  },

  onParentResized(id, diff) {
    if(id === 'left' || id === 'top') {
      let position = assign({}, this.position);
      let calc = key => position[key] += diff[key];
      calc('x');
      calc('y');
      this.update({ position });
    }
  },

});
