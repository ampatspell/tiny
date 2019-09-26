import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { all } from 'rsvp';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';
import { frame, pixelFrame, absolutePixel } from '../../-frame';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'sprites/sprite',
  typeName: 'Sprite',

  project: readOnly('sprites.project'),

  sprites: null,
  doc: null,

  index: data('index'),
  identifier: data('identifier'),
  position: data('position.serialized'),
  size: data('size.serialized'),
  thumbnail: data('thumbnail'),
  pixel: data('pixel'),

  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('sprites.chainHidden', 'hidden'),
  chainLocked: or('sprites.chainLocked', 'locked'),

  properties: properties(),

  frames: model().named('project/sprites/sprite/frames').mapping(sprite => ({ sprite })),
  loops: model().named('project/sprites/sprite/loops').mapping(sprite => ({ sprite })),

  //

  absolutePixel: absolutePixel('project.pixel', 'pixel'),

  frame: frame(),
  pixelFrame: pixelFrame('project.pixel', 'pixel'),

  //

  async load({ type }) {
    if(type === 'detail') {
      await all([
        this.frames.load({ type }),
        this.loops.load({ type })
      ]);
    }
  },

  onShortcutDigit(pixel) {
    this.update({ pixel });
  },

  willDelete() {
    this.project.selectIf(this, this.sprites);
  },

  async moveUp() {
    await this.sprites.moveUp(this);
  },

  async moveDown() {
    await this.sprites.moveDown(this);
  },

});
