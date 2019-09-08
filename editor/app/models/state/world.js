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
  locked: readOnly('world.locked'),

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
    let scene = await this.world.createScene(opts);
    this.select(scene);
  },

  async deleteScene(scene) {
    if(this.selection === scene) {
      this.update({ selection: null });
    }
    await scene.delete();
  }

});
