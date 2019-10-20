import EmberObject, { computed } from '@ember/object';
import DocMixin, { data } from './-doc';
import { model } from 'ember-cli-zuglet/lifecycle';
import { properties } from './project/properties';
import { EditorMixin } from './project/editor';
import { split } from 'editor/utils/object';
import { render } from './project/-render';
import { entities } from './project/-entities';

const position = def => computed({
  get(key) {
    return this[`_${key}`] || def;
  },
  set(key, value) {
    this[`_${key}`] = value;
    return value;
  }
});

const selected = () => computed('selection.model', function() {
  return this.selection.model === this;
}).readOnly();

export default EmberObject.extend(DocMixin, EditorMixin, {

  type: 'project',
  baseType: 'project',
  typeName: 'Project',

  projects: null,
  doc: null,

  title: data('title'),
  pixel: data('pixel'),
  token: data('token'),

  origin: position({ x: 0, y: 0 }),
  properties: properties(),
  render: render('project'),

  content: model().named('project/content').mapping(project => ({ project })),

  entities: entities('project'),

  scenes: model().named('project/scenes').mapping(model => ({ model })),
  sprites: model().named('project/sprites').mapping(model => ({ model })),

  selection: model().named('project/selection').mapping(project => ({ project })),

  isSelected: selected(),

  //

  update(props) {
    let [ local, remote ] = split(props, [ 'origin' ]);
    this.setProperties(local);
    this._super(remote);
  },

  //

  async load({ type }) {
    if(type === 'detail') {
      setGlobal({ project: this });
      await this.content.load();
    }
  },

  select() {
    return this.selection.select(...arguments);
  },

  edit() {
    return this.selection.edit(...arguments);
  },

  //

  didCreateScene(scene) {
    this.select(scene);
  },

  didCreateLayer(layer) {
    this.select(layer);
  },

  didCreateNode(node) {
    this.select(node);
    node.scene.edit();
  },

  didCreateSprite(sprite) {
    this.select(sprite);
  },

  //

  _willDeleteEntity(entity, prop, next) {
    let selection = this.selection.model;
    if(selection) {
      if(selection === entity || selection[prop] === entity) {
        this.select(next);
      }
    }
    this.edit(null);
  },

  willDeleteScene(scene) {
    this._willDeleteEntity(scene, 'scene', null);
  },

  willDeleteLayer(layer) {
    this._willDeleteEntity(layer, 'layer', layer.scene);
  },

  willDeleteNode(node) {
    this._willDeleteEntity(node, 'node', node.layer);
  },

  willDeleteSprite(sprite) {
    this._willDeleteEntity(sprite, 'sprite', null);
  },

  willDeleteFrame() {
  },

  willDeleteLoop() {
  },

  //

  onShortcutDigit(value) {
    if(value < 1) {
      return;
    }
    let selection = this.selection.model;
    if(selection && selection !== this && selection.onShortcutDigit) {
      selection.onShortcutDigit(value);
    } else {
      this.update({ pixel: value });
    }
  },

  onShortcutEscape() {
    let { selection } = this;
    if(selection.editing) {
      selection.edit(null);
    } else {
      selection.select(null);
    }
  },

  _invokeShortcut(name) {
    let model = this.selection.model;
    if(model && model !== this) {
      let fn = model[name];
      fn && fn.call(model);
    }
  },

  onShortcutUp() {
    this._invokeShortcut('onShortcutUp');
  },

  onShortcutDown() {
    this._invokeShortcut('onShortcutDown');
  },

  onShortcutLeft() {
    this._invokeShortcut('onShortcutLeft');
  },

  onShortcutRight() {
    this._invokeShortcut('onShortcutRight');
  },

});
