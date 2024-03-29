import Node from '../-node';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { drawImageFlipped } from 'editor/utils/canvas';

const observe = [ 'frame', 'sceneFunc', 'hitFunc' ];

export default Node.extend({

  nodeClassName: 'shape',
  observe,

  sprite: readOnly('model.sprite'),
  flip: readOnly('model.flip'),
  invert: readOnly('model.invert'),
  omit: readOnly('model.omit'),
  pixel: readOnly('model.project.pixel'),
  frame: readOnly('_frame'),

  canvas: computed('sprite.size', function() {
    let { sprite } = this;
    if(!sprite) {
      return;
    }
    let { size: { width, height } } = sprite;
    let element = document.createElement('canvas');
    element.width = width;
    element.height = height;
    let ctx = element.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { element, ctx };
  }).readOnly(),

  content: computed('rendered', 'canvas', 'flip', 'invert', 'omit', function() {
    let { canvas, rendered, flip, invert, omit } = this;

    if(!canvas) {
      return;
    }

    if(!rendered) {
      return;
    }

    flip = flip || {};

    let { element, ctx } = canvas;

    ctx.clearRect(0, 0, element.width, element.height);
    drawImageFlipped(ctx, rendered, flip.horizontal, flip.vertical);

    if(invert || omit) {
      let imageData = ctx.getImageData(0, 0, element.width, element.height);
      let data = imageData.data;
      for(let i = 0; i < data.length; i += 4) {
        let color = data[i];
        if(invert)  {
          color = color === 0 ? 255 : 0;
          data[i + 0] = color;
          data[i + 1] = color;
          data[i + 2] = color;
        }
        if(omit) {
          if(omit === 'black') {
            if(color === 0) {
              data[i + 3] = 0;
            }
          } else if(omit === 'white') {
            if(color === 255) {
              data[i + 3] = 0;
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    return element;
  }).readOnly(),

  bounds: computed('model.{size,alignment}', 'pixel', 'sprite.size', function() {
    let { model: { size, alignment }, pixel, sprite } = this;

    if(!sprite) {
      return;
    }

    let x = 0;
    let y = 0;
    let width = sprite.size.width;
    let height = sprite.size.height;

    if(alignment) {
      let { horizontal, vertical } = alignment;
      if(horizontal === 'left') {
        x = 0;
      } else if(horizontal === 'middle') {
        x = Math.round(size.width / 2 - width / 2);
      } else if(horizontal === 'right') {
        x = size.width - width;
      }
      if(vertical === 'top') {
        y = 0;
      } else if(vertical === 'middle') {
        y = Math.round(size.height / 2 - height / 2);
      } else if(vertical === 'bottom') {
        y = size.height - height;
      }
    }

    let px = value => value * pixel;

    return {
      x:      px(x),
      y:      px(y),
      width:  px(width),
      height: px(height)
    };
  }).readOnly(),

  sceneFunc: computed('frame', 'bounds', 'content', function() {
    let { frame, bounds, content } = this;
    return ctx => {
      if(content) {
        this.disableImageSmoothing();
        let { x, y, width, height } = bounds;
        ctx.drawImage(content, x, y, width, height);
      } else {
        ctx.fillStyle = 'rgba(253, 96, 96, 0.5)';
        let { width, height } = frame;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }).readOnly(),

  hitFunc: computed(function() {
    return (ctx, node) => {
      ctx.beginPath();
      ctx.rect(0, 0, node.width(), node.height());
      ctx.closePath();
      ctx.fillStrokeShape(node);
    }
  }).readOnly(),

  props: computed('frame', 'sceneFunc', 'hitFunc', function() {
    let { frame: { width, height }, sceneFunc, hitFunc } = this;
    return {
      width,
      height,
      sceneFunc,
      hitFunc
    };
  }).readOnly()

});
