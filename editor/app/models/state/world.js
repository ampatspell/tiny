import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  world: null,
  scenes: readOnly('world.scenes'),

  pixel: 3,

  editor: null,

  onEditorCreated(editor) {
    this.setProperties({ editor });
  },

  center() {
    this.editor && this.editor.center();
  },

  //

  update(props) {
    this.setProperties(props);
  },

  //

  async createScene(opts) {
    await this.world.createScene(opts);
  },

  async deleteScene(scene) {
    await scene.delete();
  }

});
