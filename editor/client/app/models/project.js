import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { data } from './-doc';
import { model } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';
import { properties } from './properties';
import { EditorMixin } from './project/editor';

export default EmberObject.extend(DocMixin, EditorMixin, {

  typeGroup: 'project',
  typeName: 'Project',
  baseTypeName: 'Project',

  projects: null,
  doc: null,

  title: data('title'),
  pixel: data('pixel'),
  token: data('token'),

  hidden: data('hidden'),
  locked: data('locked'),
  chainHidden: readOnly('hidden'),
  chainLocked: readOnly('locked'),

  properties: properties(),

  sprites: model().named('project/sprites').mapping(project => ({ project })),
  scenes: model().named('project/scenes').mapping(project => ({ project })),
  render: model().named('project/render').mapping(model => ({ model })),

  //

  async load({ type }) {
    if(type === 'detail') {
      setGlobal({ project: this });
      await all([
        this.sprites.load({ type }),
        this.scenes.load({ type })
      ]);
    }
  },

  //

  selection: null,
  editing: null,

  select(selection) {
    selection = selection || null;
    this.setProperties({ selection });
    return selection;
  },

  deselect() {
    this.select(null);
    this.edit(null);
  },

  edit(editing) {
    editing = editing || null;
    this.setProperties({ editing });
  },

  //

  // TODO project thumbnail
  // async createThumbnailFromDataURL(dataURL) {
  //   if(this.skipCreateThumbnail) {
  //     return;
  //   }

  //   let { store, doc } = this;

  //   let blob = await imageURLToBlob(dataURL);
  //   let url = null;

  //   if(blob) {
  //     let ref = store.storage.ref(`${doc.ref.path}/thumbnail.png`);
  //     await ref.put({
  //       type: 'data',
  //       data: blob,
  //       metadata: {
  //         contentType: 'image/png'
  //       }
  //     });

  //     let { value } = await ref.url.load();
  //     url = value;
  //   }

  //   doc.data.setProperties({ thumbnail: url });

  //   await this.save();
  // },

  //

  onShortcutDigit(pixel) {
    if(pixel < 1) {
      return;
    }
    let selection = this.selection;
    if(selection && selection.onShortcutDigit) {
      selection.onShortcutDigit(pixel);
    } else {
      this.update({ pixel });
    }
  },

  onShortcutEscape() {
    if(this.editing) {
      this.edit();
    } else {
      this.deselect();
    }
  },

  _selectionRenderDetails() {
    return this.get('selection.render.details') || this.get('selection');
  },

  _invokeShortcut(model, name) {
    if(!model) {
      return false;
    }
    let fn = model[name];
    if(!fn) {
      return false;
    }
    fn.call(model);
    return true;
  },

  onShortcutUp() {
    this._invokeShortcut(this._selectionRenderDetails(), 'onShortcutUp');
  },

  onShortcutDown() {
    this._invokeShortcut(this._selectionRenderDetails(), 'onShortcutDown');
  },

  onShortcutLeft() {
    this._invokeShortcut(this._selectionRenderDetails(), 'onShortcutLeft');
  },

  onShortcutRight() {
    this._invokeShortcut(this._selectionRenderDetails(), 'onShortcutRight');
  },

  //

  onWillDeleteEditable(model, next) {
    let { selection, editing } = this;
    if(selection !== model) {
      return;
    }
    selection = next;
    if(editing === model) {
      editing = null;
    }
    this.setProperties({ selection, editing });
  },

  async onWillDeleteSprite(sprite) {
    this.onWillDeleteEditable(sprite, this.sprites);
  },

  async onWillDeleteScene(scene) {
    this.onWillDeleteEditable(scene, this.scenes);
  },

  async onWillDeleteLayer(layer) {
    this.onWillDeleteEditable(layer, layer.scene);
  },

  async onWillDeleteNode(node) {
    this.onWillDeleteEditable(node, node.layer);
  },

  async onDidCreateScene(scene) {
    this.select(scene);
  },

  async onDidCreateLayer(layer) {
    this.select(layer);
  },

  async onDidCreateNode(node) {
    let scene = node.scene;
    this.select(node);
    this.edit(scene);
  },

});
