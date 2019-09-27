import Node from '../../../../../../../-node';
import { readOnly, not, and } from '@ember/object/computed';
import { computed } from '@ember/object';

const observe = [ 'frame', 'listening', 'editable' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  frame: readOnly('model.render.frame'),
  pixel: readOnly('model.render.pixel'),
  enabled: not('disabled'),
  editable: and('model.scene.isEditing', 'enabled'),
  layer: readOnly('model.layer'),

  listening: not('model.chainLocked'),

  props: computed('frame', 'listening', 'editable', function() {
    let { frame: { x, y }, listening, editable: draggable } = this;
    return {
      x,
      y,
      listening,
      draggable
    };
  }).readOnly(),

  onClick(e) {
    e.cancelBubble = true;
    this.model.select();
    if(this.isDoubleClick()) {
      this.model.scene.edit();
    }
  },

  //

  isDragging: false,

  onDragstart(e) {
    e.cancelBubble = true;
    this.setProperties({ isDragging: true });
    this.model.select();
  },

  onDragmove(e) {
    if(!this.isDragging) {
      return;
    }

    e.cancelBubble = true;

    let { x, y } = this.nodeAttributes();
    let { pixel } = this;

    let position = {
      x: Math.floor(x / pixel),
      y: Math.floor(y / pixel)
    };

    position = this.layer.clampNodePosition(this.model, position);

    x = position.x * pixel;
    y = position.y * pixel;

    this.setNodeAttributes({ x, y });

    let current = this._dragPosition;
    if(current && current.x === position.x && current.y === position.y) {
      return;
    }

    this.set('_dragPosition', position);
    this.model.update({ position });
  },

  onDragend(e) {
    if(!this.isDragging) {
      return;
    }
    e.cancelBubble = true;
    this.setProperties({ isDragging: false, _dragPosition: null });
  }

});
