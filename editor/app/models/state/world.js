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

  onEditorDestroying(editor) {
    let url = editor.toDataURL();
    this.world.createThumbnailFromDataURL(url);
    this.setProperties({ editor: null });
  },

  center() {
    this.editor && this.editor.center();
  },

  //

  update(props) {
    this.setProperties(props);
  },

  //

  didSelect() {
    let parent = this.selection.parent;
    while(parent) {
      parent.update({ collapsed: false });
      parent = parent.parent;
    }
  },

  select(selection) {
    selection = selection || null;
    this.update({ selection });
    if(selection) {
      this.didSelect(selection);
    }
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

  onSpriteSelected(sprite) {
    let { node } = this;
    node && node.onSprite && node.onSprite(sprite);
  },

  selectSprite(sprite) {
    sprite = sprite || null;
    this.update({ sprite });
    if(sprite) {
      this.onSpriteSelected(sprite);
    }
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

  async createSpriteNode() {
    let sprite = this.sprite && this.sprite.identifier;
    await this.createNode({
      type: 'sprite',
      position: {
        x: 0,
        y: 0,
      },
      alignment: {
        vertical: 'top',
        horizontal: 'left'
      },
      sprite
    });
  },

  async createFillNode() {
    await this.createNode({
      type: 'fill',
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 8,
        height: 8
      },
      color: 'black'
    });
  },

  async deleteScene(scene) {
    this.update({ selection: null });
    await scene.delete();
  },

  async deleteNode(node) {
    this.update({ selection: node.layer });
    await node.delete();
  },

  async deleteLayer(layer) {
    this.select(layer.scene);
    await layer.delete();
  },

  async deleteWorld() {
    let promise = this.world.delete();
    this.router.transitionTo('projects.project');
    await promise;
  }

});
