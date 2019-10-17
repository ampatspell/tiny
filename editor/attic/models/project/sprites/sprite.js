import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { all } from 'rsvp';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';
import { selected, editing } from '../-selection';
import { assign } from '@ember/polyfills';

export default EmberObject.extend(DocMixin, {

  // typeGroup: 'sprites/sprite',
  // typeName: 'Sprite',
  // baseTypeName: 'Sprite',

  // project: readOnly('sprites.project'),

  // sprites: null,
  // doc: null,

  // index: data('index'),
  // identifier: data('identifier'),
  // position: data('position.serialized'),
  // size: data('size.serialized'),
  // pixel: data('pixel'),

  // hidden: data('hidden'),
  // locked: data('locked'),

  // chainHidden: or('sprites.chainHidden', 'hidden'),
  // chainLocked: or('sprites.chainLocked', 'locked'),

  // properties: properties(),

  // frames: model().named('project/sprites/sprite/frames').mapping(sprite => ({ sprite })),
  // loops: model().named('project/sprites/sprite/loops').mapping(sprite => ({ sprite })),
  // render: model().named('project/sprites/sprite/render').mapping(model => ({ model })),

  //

  isSelected: selected(),
  isEditing: editing(),

  //

  // async load({ type }) {
  //   if(type === 'detail') {
  //     await all([
  //       this.frames.load({ type }),
  //       this.loops.load({ type })
  //     ]);
  //   }
  // },

  //

  // async resize(handle, diff) {
  //   if(diff.x === 0 && diff.y === 0) {
  //     return false;
  //   }

  //   let size = assign({}, this.size);
  //   size.width += diff.x;
  //   size.height += diff.y;

  //   if(size.width < 1 || size.height < 1) {
  //     return false;
  //   }

  //   let pixel = this.pixel;
  //   let position = assign({}, this.position);
  //   if(handle === 'left') {
  //     position.x -= (diff.x * pixel);
  //   } else if(handle === 'top') {
  //     position.y -= (diff.y * pixel);
  //   }

  //   let { doc, frames } = this;

  //   await this.store.batch(batch => {
  //     frames.resize(batch, handle, size);
  //     doc.set('data.size', size);
  //     doc.set('data.position', position);
  //     batch.save(doc);
  //   });

  //   return true;
  // },

  //

  async willDelete() {
    await this.project.onWillDeleteSprite(this);
  },

  // async moveUp() {
  //   await this.sprites.moveUp(this);
  // },

  // async moveDown() {
  //   await this.sprites.moveDown(this);
  // },

  //

  onShortcutDigit(pixel) {
    this.update({ pixel });
  },

  onShortcutLeft() {
    this.frames.selectPrevious();
  },

  onShortcutRight() {
    this.frames.selectNext();
  },

  //

  select() {
    this.project.select(this);
  },

  edit() {
    this.project.edit(this);
  },

  //

  // onResize(id, diff) {
  //   this.resize(id, diff);
  // },

  //

  async onWillDeleteLoop() {
  },

  async onDidDeleteLoop() {
  },

  async onWillDeleteFrame(frame) {
    await this.loops.onWillDeleteFrame(frame);
  },

  async onDidDeleteFrame(frame) {
    await this.loops.onDidDeleteFrame(frame);
  }

});
