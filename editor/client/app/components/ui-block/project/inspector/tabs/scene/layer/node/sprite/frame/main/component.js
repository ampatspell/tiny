import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-tabs-scene-layer-node-sprite-frame-main' ],

  frames: computed('model.spriteFrames.@each.{index,identifier}', function() {
    let { model: { spriteFrames } } = this;
    if(!spriteFrames) {
      return;
    }
    return A(spriteFrames.map(frame => {
      let { index, identifier } = frame;
      let label = `${identifier} (#${index})`;
      return {
        identifier,
        label
      };
    })).compact();
  }).readOnly(),

  frame: computed('frames.@each.identifier', 'model.spriteFrame.identifier', function() {
    let { model: { spriteFrame } } = this;
    if(!spriteFrame) {
      return;
    }
    return this.frames.findBy('identifier', spriteFrame.identifier);
  }).readOnly(),

  actions: {
    frame({ identifier }) {
      this.update('frame', identifier);
    }
  }

});
