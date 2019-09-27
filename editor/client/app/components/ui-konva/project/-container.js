import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DraggableMixin from './-dragable';

const observe = [ 'frame', 'draggable', 'locked' ];

export default Mixin.create(DraggableMixin, {

  nodeClassName: 'group',
  observe,

  model: null,
  project: null,

  frame:  readOnly('model.render.frame'),
  locked: readOnly('model.chainLocked'),
  hidden: readOnly('model.chainHidden'),
  editing: readOnly('model.isEditing'),

  draggable: computed('disabled', 'locked', 'editing', function() {
    let { disabled, locked, editing } = this;
    return !disabled && !locked && !editing;
  }).readOnly(),

  props: computed('frame', 'draggable', 'locked', function() {
    let { frame, draggable, locked } = this;
    return {
      x: frame.x,
      y: frame.y,
      listening: !locked,
      draggable
    };
  }),

  onClick(e) {
    e.cancelBubble = true;
    this.model.select(true);
    if(this.isDoubleClick()) {
      this.model.edit();
    }
  }

});
