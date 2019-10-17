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
  editable: readOnly('model.render.editable'),
  draggable: readOnly('model.render.draggable'),

  props: computed('frame', 'draggable', function() {
    let { frame, draggable } = this;
    return {
      x: frame.x,
      y: frame.y,
      draggable
    };
  }),

  onClick(e) {
    e.cancelBubble = true;

    this.model.select();

    if(this.isDoubleClick()) {
      let { editable } = this;
      editable && editable.edit();
    }
  }

});
