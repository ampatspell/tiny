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
  hidden: readOnly('model.render.hidden'),
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
    console.log('click', this+'');
    // this.model.select(true);
    if(this.locked) {
      return;
    }
    if(this.isDoubleClick()) {
      // this.model.edit();
    }
  }

});
