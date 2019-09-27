import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import TickComponentMixin from 'editor/utils/tick-component-mixin';

const size = key => computed(`sprite.size.${key}`, 'pixel', function() {
  let { sprite: { size }, pixel } = this;
  return size[key] * pixel;
}).readOnly();

export default Component.extend(TickComponentMixin, {
  tagName: 'canvas',
  classNameBindings: [ ':ui-block-sprites-sprite-loop-preview' ],
  attributeBindings: [ 'style', 'width', 'height' ],

  loop: null,
  sprite: readOnly('loop.sprite'),
  frames: readOnly('loop._framesPreviewRendered'),

  pixel: 4,
  width: size('width'),
  height: size('height'),

  style: computed('width', 'height', function() {
    let { width, height } = this;
    return htmlSafe(`width: ${width}px; height: ${height}px`);
  }).readOnly(),

  index: 0,

  onTick() {
    let { element, frames, index, width, height } = this;

    let frame;

    if(frames) {
      if(index > frames.length - 1) {
        index = 0;
      }
      frame = frames.objectAt(index);
    }

    let ctx = element.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);

    if(frame) {
      ctx.drawImage(frame, 0, 0, width, height);
    } else {
      ctx.fillStyle = "rgba(253, 96, 96, 0.5)";
      ctx.fillRect(0, 0, width, height);
    }

    this.set('index', ++index);
  },

});
