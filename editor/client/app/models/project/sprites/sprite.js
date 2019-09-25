import EmberObject from '@ember/object';
import { doc, data } from 'editor/utils/computed';
import { all } from 'rsvp';
import { model } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  sprites: null,
  doc: null,

  id: doc('id'),
  ref: doc('ref'),

  identifier: data('identifier'),
  locked: data('locked'),
  size: data('size.serialized'),

  frames: model().named('project/sprites/sprite/frames').mapping(sprite => ({ sprite })),
  loops: model().named('project/sprites/sprite/loops').mapping(sprite => ({ sprite })),

  async load({ type }) {
    if(type === 'detail') {
      await all([
        this.frames.load({ type }),
        this.loops.load({ type })
      ]);
    }
  }

});
