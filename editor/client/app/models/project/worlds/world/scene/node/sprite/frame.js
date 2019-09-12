import Sprite, { data } from './sprite';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Sprite.extend({

  name: 'Sprite Frame',

  _frame: data('frame'),
  frames: readOnly('sprite.frames'),

  // TODO: frame index
  selected: computed('frames.@each.index', '_frame', function() {
    let { frames, _frame: index } = this;
    if(!frames || typeof index !== 'number') {
      return;
    }
    return frames.findBy('index', index);
  }).readOnly(),

  onSprite(sprite) {
    this._super(...arguments);
    if(!sprite) {
      return;
    }
    // TODO: frame index
    let frame = sprite.get('frames.firstObject.index');
    if(typeof frame !== 'number') {
      frame = null;
    }
    this.update({ frame });
  }

});