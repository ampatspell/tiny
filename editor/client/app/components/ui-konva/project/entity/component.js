import Node from '../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DraggableMixin from '../-dragable';

const observe = [ 'frame', 'draggable' ];

export default Node.extend(DraggableMixin, {

  nodeClassName: 'group',
  observe,

  model: null,
  project: null,

  frame:  readOnly('model.render.frame'),
  draggable: readOnly('model.render.draggable'),

  props: computed('frame', 'draggable', function() {
    let { frame, draggable } = this;
    if(!frame) { // TODO: deleted parent
      return;
    }
    return {
      x: frame.x,
      y: frame.y,
      draggable
    };
  }),

  onClick(e) {
    e.cancelBubble = true;
    this.model.onClick();
    if(this.isDoubleClick()) {
      this.model.onDoubleClick();
    }
  }

});
