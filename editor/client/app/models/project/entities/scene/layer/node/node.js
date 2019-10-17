import Entity, { data, render } from '../../../entity';
import { readOnly } from '@ember/object/computed';
import { assign } from '@ember/polyfills';

export {
  data
}

const shortcut = fn => function(...args) {
  let { render: { draggable } } = this;
  if(draggable) {
    fn.call(this, ...args);
  }
}

export default Entity.extend({

  baseType: 'scene/layer/node',
  baseTypeName: 'Node',

  layer: readOnly('parent'),
  scene: readOnly('layer.scene'),
  container: readOnly('scene'),

  render: render('scene/layer/node'),

  positionDeltaIncrement: readOnly('parent.positionDeltaIncrement'),

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

  updatePositionDelta({ x, y }) {
    let { position } = this;

    let inc = this.positionDeltaIncrement;

    position = {
      x: position.x + (x * inc.x),
      y: position.y + (y * inc.y)
    };

    position = this.clampPosition(position);

    this.update({ position });
  },

  onPositionShortcut(delta) {
    this.updatePositionDelta(delta);
  },

  onShortcutUp: shortcut(function() {
    this.onPositionShortcut({ x: 0, y: -1 });
  }),

  onShortcutDown: shortcut(function() {
    this.onPositionShortcut({ x: 0, y: +1 });
  }),

  onShortcutRight: shortcut(function() {
    this.onPositionShortcut({ x: +1, y: 0 });
  }),

  onShortcutLeft: shortcut(function() {
    this.onPositionShortcut({ x: -1, y: 0 });
  }),

  async willDelete() {
    await this.layer.willDeleteNode(this);
  },

});
