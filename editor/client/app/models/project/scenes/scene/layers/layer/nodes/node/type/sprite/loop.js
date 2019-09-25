import Sprite, { data } from '../sprite';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Sprite.extend({

  typeName: 'Sprite Loop Node',

  _loop: data('loop'),
  spriteLoops: readOnly('sprite.loops.models'),

  spriteLoop: computed('spriteLoops.@each.identifier', '_loop', function() {
    let { spriteLoops, _loop: identifier } = this;
    if(!spriteLoops || !identifier) {
      return;
    }
    return spriteLoops.findBy('identifier', identifier);
  }).readOnly(),

  // onSprite(sprite) {
  //   this._super(...arguments);
  //   if(!sprite) {
  //     return;
  //   }
  //   let loop = sprite.get('loops.firstObject.identifier') || null;
  //   this.update({ loop });
  // }

});
