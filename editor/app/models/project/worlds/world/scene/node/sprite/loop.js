import Sprite, { data } from './sprite';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Sprite.extend({

  name: 'Sprite Loop',

  _loop: data('loop'),
  _loops: readOnly('sprite.loops'),

  spriteLoop: computed('_loops.@each.identifier', '_loop', function() {
    let { _loops: loops, _loop: identifier } = this;
    if(!loops || !identifier) {
      return;
    }
    return loops.findBy('identifier', identifier);
  }).readOnly(),

  onSprite(sprite) {
    this._super(...arguments);
    if(!sprite) {
      return;
    }
    let loop = sprite.get('loops.firstObject.identifier') || null;
    this.update({ loop });
  }

});