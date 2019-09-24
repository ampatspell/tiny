import Sprite, { data } from './sprite';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Sprite.extend({

  name: 'Sprite Frame',

  _frame: data('frame'),
  frames: readOnly('sprite.frames'),

  selected: computed('frames.@each.identifier', '_frame', function() {
    let { frames, _frame: identifier } = this;
    if(!frames || !identifier) {
      return;
    }
    return frames.findBy('identifier', identifier);
  }).readOnly(),

  onSprite(sprite) {
    this._super(...arguments);
    if(!sprite) {
      return;
    }
    let frame = sprite.get('frames.firstObject.identifier') || null;
    this.update({ frame });
  }

});
