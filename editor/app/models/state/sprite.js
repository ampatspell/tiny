import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { delta, current } from 'editor/utils/computed';
import alive from 'editor/utils/alive';

export default EmberObject.extend({

  editor: null,

  frames: readOnly('sprite.frames'),

  prev: delta('frames', 'frame', -1),
  next: delta('frames', 'frame', +1),

  frame: current('frames', 0),

  pixel: 16,

  onEditorCreated(editor) {
    this.setProperties({ editor });
  },

  update: alive(function(props) {
    this.setProperties(props);
  }),

  center() {
    this.editor.center();
  },

  onLeft() {
    let frame = this.prev;
    frame && this.update({ frame });
  },

  onRight() {
    let frame = this.next;
    frame && this.update({ frame });
  },

  async duplicate() {
    let frame = await this.frame.duplicate();
    this.update({ frame });
  },

  async delete() {
    let { frame, prev } = this;
    this.update({ frame: prev });
    await frame.delete();
  },

  async createLoop() {
    await this.sprite.createLoop();
  }

});
