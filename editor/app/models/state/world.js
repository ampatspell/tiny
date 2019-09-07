import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  world: null,
  scenes: readOnly('world.scenes'),

  pixel: 3,

  editor: null,
  scene: null,

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

  async selectScene(scene) {
    this.update({ scene });
  },

  async createScene(opts) {
    await this.world.createScene(opts);
  },

  async deleteScene(scene) {
    if(this.scene === scene) {
      this.update({ scene: null });
    }
    await scene.delete();
  }

});
