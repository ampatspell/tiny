import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-sidebar' ],
  attributeBindings: [ 'style' ],

  state: null,
  sprite: readOnly('state.sprite'),
  frame: readOnly('state.frame'),

  style: computed('sprite.size.width', function() {
    let { sprite: { size: { width } } } = this;
    width = Math.max(200, (width * 2) + 21);
    return htmlSafe(`width: ${width}px`);
  }).readOnly(),

  actions: {
    center() {
      this.state.center();
    },
    pixel(pixel) {
      this.state.update({ pixel });
    },
    fill(value) {
      this.frame.fill(value);
    },
    invert() {
      this.frame.invert();
    },
    create() {
      this.sprite.createFrame();
    },
    duplicate() {
      this.state.duplicate();
    },
    delete() {
      this.state.delete();
    }
  },

});
