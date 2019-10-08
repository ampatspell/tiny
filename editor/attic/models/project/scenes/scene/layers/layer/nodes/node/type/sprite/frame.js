import Sprite, { data } from '../sprite';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Sprite.extend({

  typeName: 'Sprite Frame Node',

  _frame: data('frame'),
  spriteFrames: readOnly('sprite.frames.ordered'),

  spriteFrame: computed('spriteFrames.@each.identifier', '_frame', function() {
    let { spriteFrames, _frame: identifier } = this;
    if(!spriteFrames || !identifier) {
      return;
    }
    return spriteFrames.findBy('identifier', identifier);
  }).readOnly(),

  onFrame(frame) {
    let { sprite, identifier } = frame;
    if(!this.onSprite(sprite)) {
      return;
    }
    this.update({ frame: identifier });
  }

});
