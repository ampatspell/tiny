import EmberObject from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { all } from 'rsvp';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'sprites/sprite',
  typeName: 'Sprite',

  project: readOnly('sprites.project'),

  sprites: null,
  doc: null,

  identifier: data('identifier'),
  size: data('size.serialized'),

  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('sprites.chainHidden', 'hidden'),
  chainLocked: or('sprites.chainLocked', 'locked'),

  properties: properties(),

  frames: model().named('project/sprites/sprite/frames').mapping(sprite => ({ sprite })),
  loops: model().named('project/sprites/sprite/loops').mapping(sprite => ({ sprite })),

  async load({ type }) {
    if(type === 'detail') {
      await all([
        this.frames.load({ type }),
        this.loops.load({ type })
      ]);
    }
  },

  willDelete() {
    this.project.selectIf(this, this.sprites);
  }

});
