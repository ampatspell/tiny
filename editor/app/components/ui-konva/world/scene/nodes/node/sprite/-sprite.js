import Node from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { drawImageFlipped } from 'editor/utils/canvas';

const observe = [ 'size', 'bounds', 'content' ];

export default Node.extend({

  nodeClassName: 'shape',
  observe,

  sprite: readOnly('layerNode.sprite'),
  rendered: readOnly('sprite.frames.firstObject.preview.rendered'),
  flip: readOnly('layerNode.flip'),

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

  content: computed('rendered', 'canvas', 'flip', function() {
    let { canvas, rendered, flip } = this;

    if(!canvas) {
      return;
    }

    if(!rendered) {
      return;
    }

    flip = flip || {};

    let { element, ctx } = canvas;
    drawImageFlipped(ctx, rendered, flip.horizontal, flip.vertical);

    return element;
  }).readOnly(),

  bounds: computed('layerNode.{size,alignment}', 'pixel', 'sprite.size', function() {
    let { layerNode: { size, alignment }, pixel, sprite } = this;

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

  sceneFunc: computed('size', 'bounds', 'content', function() {
    let { size, bounds, content } = this;
    return ctx => {
      if(content) {
        this.disableImageSmoothing();
        let { x, y, width, height } = bounds;
        ctx.drawImage(content, x, y, width, height);
      } else {
        ctx.fillStyle = 'rgba(253, 96, 96, 0.5)';
        let { width, height } = size;
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

  customProps: computed('sprite', 'size', 'sceneFunc', 'hitFunc', function() {
    let { size: { width, height }, sceneFunc, hitFunc } = this;
    return {
      width,
      height,
      sceneFunc,
      hitFunc
    };
  }).readOnly()

});