import Node from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'size', 'rendered', 'bounds' ];

export default Node.extend({

  nodeClassName: 'shape',
  observe,

  sprite: readOnly('layerNode.sprite'),
  frame: readOnly('sprite.frames.firstObject'),
  rendered: readOnly('frame.preview.rendered'),

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

  sceneFunc: computed('size', 'bounds', 'rendered', function() {
    let { size, bounds, rendered } = this;
    return ctx => {
      if(rendered) {
        this.disableImageSmoothing();
        let { x, y, width, height } = bounds;
        ctx.drawImage(rendered, x, y, width, height);
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
