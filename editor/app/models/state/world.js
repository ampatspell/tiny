import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  world: null,
  scenes: readOnly('world.scenes'),

  editor: null,

  onEditorCreated(editor) {
    this.setProperties({ editor });
  },

  center() {
    this.editor && this.editor.center();
  },

  //

  async createScene(opts) {
    await this.world.createScene(opts);
  },

  async deleteScene(scene) {
    await scene.delete();
  }

});
