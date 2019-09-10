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

  locked: readOnly('world.locked'),

  pixel: 4,

  editor: null,

  selection: null,
  scene: selection('isScene'),
  layer: selection('isLayer'),
  node:  selection('isNode'),

  //

  sprites: readOnly('project.sprites'),
  sprite: null,

  //

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

  select(selection) {
    selection = selection || null;
    this.update({ selection });
  },

  selectParent(scene) {
    let { selection } = this;

    if(!selection) {
      this.select(scene);
      return;
    }

    if(selection.scene !== scene) {
      this.select(scene);
      return;
    }

    let { parent } = selection;

    if(!parent) {
      this.select(scene);
      return;
    }

    this.select(parent);
  },

  selectSprite(sprite) {
    sprite = sprite || null;
    setGlobal({ sprite });
    this.update({ sprite });
  },

  //

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
  },

  async deleteWorld() {
    let promise = this.world.delete();
    this.router.transitionTo('projects.project');
    await promise;
  }

});
