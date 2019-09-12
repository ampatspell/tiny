import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { later, cancel } from '@ember/runloop';
import { htmlSafe } from '@ember/string';

const size = key => computed(`sprite.size.${key}`, 'pixel', function() {
  let { sprite: { size }, pixel } = this;
  return size[key] * pixel;
}).readOnly();

export default Component.extend({
  tagName: 'canvas',
  classNameBindings: [ ':ui-block-sprite-loop-preview' ],
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

  didInsertElement() {
    this._super(...arguments);
    this.iterate();
  },

  willDestroyElement() {
    this._super(...arguments);
    cancel(this._iterate);
  },

  iterate() {
    let { element, frames, index, width, height } = this;

    if(index > frames.length - 1) {
      index = 0;
    }

    let frame = frames.objectAt(index);

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
    this._iterate = later(() => this.iterate(), 200);
  },

});
