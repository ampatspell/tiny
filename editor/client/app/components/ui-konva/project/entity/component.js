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
  locked: readOnly('model.render.locked'),
  editable: readOnly('model.render.editable'),
  // editing: readOnly('model.isEditing'),

  draggable: computed('disabled', 'locked', 'editing', function() {
    let { disabled, locked, editing } = this;
    return !disabled && !locked && !editing;
  }).readOnly(),

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
      if(editable) {
        console.log('editable', editable+"");
      }
    }
  }

});
