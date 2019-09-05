import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-sidebar' ],

  state: null,
  sprite: readOnly('state.sprite'),
  frame: readOnly('state.frame'),

  preview: computed('frame.preview.{url,size}', function() {
    let { frame: { preview: { url, size: { width, height } } } } = this;
    let calc = value => value * 2;
    let size = {
      width: calc(width),
      height: calc(height)
    };
    return {
      url,
      size
    };
  }).readOnly(),

  actions: {
    frame(frame) {
      this.state.update({ frame });
    },
    pixel(pixel) {
      this.state.update({ pixel });
    },
    fill(value) {
      this.frame.fill(value);
    },
    invert() {
      this.frame.invert();
    }
  }

});
