import Node from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const observe = [ 'size', 'rendered' ];

export default Node.extend({

  nodeClassName: 'shape',
  observe,

  sprite: readOnly('layerNode.sprite'),
  frame: readOnly('sprite.frames.firstObject'),
  rendered: readOnly('frame.preview.rendered'),

  sceneFunc: computed('size', 'rendered', function() {
    let { size: { width, height }, rendered } = this;
    return ctx => {
      if(rendered) {
        this.disableImageSmoothing();
        ctx.drawImage(rendered, 0, 0, width, height);

        ctx.strokeStyle = 'rgba(253, 96, 96, 0.3)';
        ctx.strokeRect(-0.5, -0.5, width + 1, height + 1);
      } else {
        ctx.fillStyle = 'rgba(253, 96, 96, 0.5)';
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
