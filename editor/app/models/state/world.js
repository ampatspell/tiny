import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const selection = key => computed(`selection.${key}`, function() {
  let { selection } = this;
  if(!selection) {
    return;
  }
  if(!selection[key]) {
    return;
  }
  return selection;
}).readOnly();

export default EmberObject.extend({

  world: null,
  scenes: readOnly('world.scenes'),

  pixel: 3,

  editor: null,

  selection: null,
  scene: selection('isScene'),
  layer: selection('isLayer'),
  node:  selection('isNode'),

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

  async select(selection) {
    selection = selection || null;
    setGlobal({ selection });
    this.update({ selection });
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
