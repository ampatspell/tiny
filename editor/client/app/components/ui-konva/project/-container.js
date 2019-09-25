import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DraggableMixin from './-dragable';

const observe = [ 'pixelFrame', 'hidden', 'draggable' ];

export default Mixin.create(DraggableMixin, {

  nodeClassName: 'group',
  observe,

  model: null,
  project: null,

  pixelFrame: readOnly('model.pixelFrame'),
  hidden: readOnly('model.hidden'),

  draggable: computed(function() {
    return true;
  }).readOnly(),

  props: computed('pixelFrame', 'hidden', 'draggable', 'index', function() {
    let { index, pixelFrame, hidden, draggable } = this;
    return {
      zIndex: index,
      x: pixelFrame.x,
      y: pixelFrame.y,
      visible: !hidden,
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
