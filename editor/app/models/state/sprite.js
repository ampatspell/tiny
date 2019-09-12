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
  loop: null,

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

  async duplicateCurrentFrame() {
    let frame = await this.frame.duplicate();
    this.update({ frame });
  },

  async deleteCurrentFrame() {
    let { frame, prev } = this;
    this.update({ frame: prev });
    await frame.delete();
  },

  async createLoop() {
    await this.sprite.createLoop();
  },

  async deleteSprite() {
    let promise = this.sprite.delete();
    this.router.transitionTo('projects.project');
    await promise;
  },

  selectLoop(loop) {
    this.setProperties({ loop });
  },

  async deleteLoop(loop) {
    if(this.loop === loop) {
      this.selectLoop(null);
    }
    await loop.delete();
  },

});
