import Render from '../../-render';
import { computed } from '@ember/object';
import { readOnly, or } from '@ember/object/computed';

export const absolute = () => computed('model.parent.render.absolute', 'frame', function() {
  let { model: { parent: { render: { absolute } } }, frame } = this;
  return {
    x: absolute.x + frame.x,
    y: absolute.y + frame.y,
    width: frame.width,
    height: frame.height
  };
}).readOnly();

export const editable = () => computed('locked', 'hidden', 'model', function() {
  let { locked, hidden, model } = this;
  if(locked || hidden) {
    return;
  }
  return model;
}).readOnly();

export default Render.extend({

  hidden: or('model.hidden', 'model.parent.render.hidden'),
  locked: or('model.locked', 'model.parent.render.locked')

});
