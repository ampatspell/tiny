import Component, { next } from '../-component';
import { readOnly } from '@ember/object/computed';
import TickMixin from 'editor/utils/tick-component-mixin';

export default Component.extend(TickMixin, {
  classNameBindings: [ ':sprite' ],

  index: 0,
  frames: readOnly('model.frames._framesPreviewRendered'),

  onTick() {
    let { frames, index } = this;

    let frame;
    if(frames) {
      index = next(index, frames.length);
      frame = frames.objectAt(index);
      this.index = index;
    }

    this.draw((ctx, { width, height }) => {
      if(!frame) {
        return false;
      }
      ctx.drawImage(frame, 0, 0, width, height);
    });
  }

});
