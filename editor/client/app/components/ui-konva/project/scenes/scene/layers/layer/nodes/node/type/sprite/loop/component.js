import Component from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import TickMixin from 'editor/utils/tick-component-mixin';

export default Component.extend(TickMixin, {

  frames: readOnly('model.spriteLoop.frames'),
  index: 0,

  rendered: computed('index', 'frames.@each._previewRendered', function() {
    let { frames, index } = this;
    if(!frames) {
      return;
    }
    let frame = frames.objectAt(index);
    if(!frame) {
      return;
    }
    return frame._previewRendered;
  }).readOnly(),

  onTick() {
    let { index, frames } = this;

    if(frames) {
      if(frames.length > index + 1) {
        index++;
      } else {
        index = 0;
      }
    } else {
      index = 0;
    }

    this.set('index', index);
  }

});
