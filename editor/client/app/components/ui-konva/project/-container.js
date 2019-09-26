import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DraggableMixin from './-dragable';

const observe = [ 'pixelFrame', 'locked', 'draggable' ];

export default Mixin.create(DraggableMixin, {

  nodeClassName: 'group',
  observe,

  model: null,
  project: null,

  pixelFrame: readOnly('model.pixelFrame'),
  locked: readOnly('model.chainLocked'),
  hidden: readOnly('model.chainHidden'),

  draggable: computed('disabled', 'locked', function() {
    let { disabled, locked } = this;
    return !disabled && !locked;
  }).readOnly(),

  props: computed('pixelFrame', 'draggable', 'index', function() {
    let { index, pixelFrame, draggable } = this;
    return {
      zIndex: index,
      x: pixelFrame.x,
      y: pixelFrame.y,
      listening: true,
      draggable
    };
  }),

  selectSelf() {
    this.project.select(this.model);
  },

  updateSelf(props) {
    this.model.update(props);
  },

  clampPosition(position) {
    return position;
  },

  onClick(e) {
    e.cancelBubble = true;
    this.selectSelf();
  },

});
