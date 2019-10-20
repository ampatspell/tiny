import Render from '../../entity/render';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Render.extend({

  sprite: readOnly('model.parent'),

  frame: computed('sprite.render.frame', function() {
    let { sprite: { render: { frame: { width, height } } } } = this;
    return {
      x: 0,
      y: 0,
      width,
      height
    };
  }).readOnly(),

  editable: computed('isAltPressed', 'isSpacePressed', 'locked', 'hidden', 'sprite.isEditing', function() {
    let { isAltPressed, isSpacePressed, locked, hidden, sprite: { isEditing } } = this;
    return isAltPressed && !isSpacePressed && !locked && !hidden && isEditing;
  }).readOnly()

});
