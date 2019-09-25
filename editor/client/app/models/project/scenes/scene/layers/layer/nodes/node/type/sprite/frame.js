import Sprite, { data } from '../sprite';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Sprite.extend({

  typeName: 'Sprite Frame Node',

  _frame: data('frame'),
  spriteFrames: readOnly('sprite.frames.models'),

  spriteFrame: computed('spriteFrames.@each.identifier', '_frame', function() {
    let { spriteFrames, _frame: identifier } = this;
    if(!spriteFrames || !identifier) {
      return;
    }
    return spriteFrames.findBy('identifier', identifier);
  }).readOnly(),

  // onSprite(sprite) {
  //   this._super(...arguments);
  //   if(!sprite) {
  //     return;
  //   }
  //   let frame = sprite.get('frames.firstObject.identifier') || null;
  //   this.update({ frame });
  // }

});
