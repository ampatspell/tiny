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
  project: readOnly('world.worlds.project'),
  sprites: readOnly('project.sprites'),

  locked: readOnly('world.locked'),

  pixel: 4,

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

  async createLayer(opts) {
    let { scene } = this;
    if(!scene) {
      return;
    }
    let layer = await scene.createLayer(opts);
    this.select(layer);
  },

  async createNode(opts) {
    let { layer } = this;
    if(!layer) {
      return;
    }
    let node = await layer.createNode(opts);
    this.select(node);
  },

  async deleteScene(scene) {
    if(this.selection === scene) {
      this.update({ selection: null });
    }
    await scene.delete();
  },

  async deleteNode(node) {
    if(this.selection === node) {
      let { layer } = node;
      this.update({ selection: layer });
    }
    await node.delete();
  },

  async deleteLayer(layer) {
    if(this.selection === layer) {
      let { stage } = layer;
      this.update({ selection: stage });
    }
    await layer.delete();
  }

});
