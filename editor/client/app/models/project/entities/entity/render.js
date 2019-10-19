import Render from '../../-render';
import { computed } from '@ember/object';
import { or, readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export const absolute = () => computed('model.parent.render.absolute', 'frame', function() {
  let { model: { parent: { render: { absolute } } }, frame } = this;
  return {
    x: absolute.x + frame.x,
    y: absolute.y + frame.y,
    width: frame.width,
    height: frame.height
  };
}).readOnly();

export const editable = () => computed('locked', 'hidden', function() {
  let { locked, hidden } = this;
  return !locked && !hidden;
}).readOnly();

export default Render.extend({

  hidden: or('model.hidden', 'model.parent.render.hidden'),
  locked: or('model.locked', 'model.parent.render.locked'),

  isSpacePressed: readOnly('model.project.editor.isSpacePressed'),
  isAltPressed:   readOnly('model.project.editor.isAltPressed'),

  dialogs: service(),

  async delete() {
    let message = this.deleteConfirmation;
    let fn = () => this.model.delete();
    if(message) {
      await this.dialogs.alert(message, 'Cancel', 'Delete', fn);
      return;
    }
    await fn();
  }

});
