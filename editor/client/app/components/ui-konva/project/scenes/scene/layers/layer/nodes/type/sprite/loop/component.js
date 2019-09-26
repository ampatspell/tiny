import Component from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { later, cancel } from '@ember/runloop';

export default Component.extend({

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

  didInsertElement() {
    this._super(...arguments);
    this.iterate();
  },

  willDestroyElement() {
    this._super(...arguments);
    cancel(this._iterate);
  },

  iterate() {
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

    // TODO: have one unique later for all animations
    this.set('index', index);
    this._iterate = later(() => this.iterate(), 250);
  }

});
