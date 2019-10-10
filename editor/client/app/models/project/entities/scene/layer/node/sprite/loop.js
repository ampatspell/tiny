import Sprite, { data } from './sprite';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Sprite.extend({

  typeName: 'Sprite Loop',

  _loop: data('loop'),
  spriteLoops: readOnly('sprite.loops.identified'),

  spriteLoop: computed('spriteLoops.@each.identified', '_loop', function() {
    let { spriteLoops, _loop: identifier } = this;
    if(!spriteLoops || !identifier) {
      return;
    }
    return spriteLoops.findBy('identifier', identifier);
  }).readOnly(),


});
