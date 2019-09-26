import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DraggableMixin from './-dragable';

const observe = [ 'frame', 'draggable', 'locked', 'index' ];

export default Mixin.create(DraggableMixin, {

  nodeClassName: 'group',
  observe,

  model: null,
  project: null,

  frame:  readOnly('model.render.frame'),
  locked: readOnly('model.chainLocked'),
  hidden: readOnly('model.chainHidden'),

  draggable: computed('disabled', 'locked', function() {
    let { disabled, locked } = this;
    return !disabled && !locked;
  }).readOnly(),

  props: computed('frame', 'draggable', 'locked', 'index', function() {
    let { index, frame, draggable, locked } = this;
    return {
      zIndex: index,
      x: frame.x,
      y: frame.y,
      listening: !locked,
      draggable
    };
  }),

  onClick(e) {
    e.cancelBubble = true;
    this.model.select(true);
  }

});
