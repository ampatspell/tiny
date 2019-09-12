import Node from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'size', 'flipped', 'bounds' ];

export default Node.extend({

  nodeClassName: 'shape',
  observe,

  sprite: readOnly('layerNode.sprite'),
  frame: readOnly('sprite.frames.firstObject'),
  preview: readOnly('frame.preview'),
  variants: readOnly('preview.variants'),
  flip: readOnly('layerNode.flip'),

  flipped: computed('variants', 'flip', function() {
    let { variants, flip } = this;
    flip = flip || {};
    if(flip.horizontal && flip.vertical) {
      return variants.flipped.both;
    } else if(flip.horizontal) {
      return variants.flipped.horizontal;
    } else if(flip.vertical) {
      return variants.flipped.vertical;
    }
    return variants.normal;
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

  sceneFunc: computed('size', 'bounds', 'flipped', function() {
    let { size, bounds, flipped } = this;
    return ctx => {
      if(flipped) {
        this.disableImageSmoothing();
        let { x, y, width, height } = bounds;
        ctx.drawImage(flipped, x, y, width, height);
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
