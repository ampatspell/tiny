import Component from '@ember/component';
import { computed } from '@ember/object';

export const next = (index, length) => {
  index++;
  if(index >= length) {
    index = 0;
  }
  return index;
}

export default Component.extend({
  classNameBindings: [ ':ui-block-sprites-preview' ],

  pixel: 2,
  model: null,

  size: computed('model.size', 'pixel', function() {
    let { model, pixel } = this;
    if(!model) {
      return;
    }
    let { size: { width, height } } = model;
    return {
      width:  width * pixel,
      height: height * pixel,
    };
  }).readOnly(),

  canvas: computed(function() {
    return this.element.querySelector('.canvas');
  }).readOnly(),

  draw(cb) {
    let { size, canvas } = this;
    if(!size) {
      return;
    }

    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, size.width, size.height);

    let result = cb(ctx, size, canvas);

    if(result === false) {
      ctx.fillStyle = "rgba(253, 96, 96, 0.5)";
      ctx.fillRect(0, 0, size.width, size.height);
    }
  }

});
