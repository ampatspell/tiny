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
    let { size, rendered } = this;
    return ctx => {
      ctx.drawImage(rendered, 0, 0, size.width, size.height);
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

  customProps: computed('size', 'sceneFunc', 'hitFunc', function() {
    let { size: { width, height }, sceneFunc, hitFunc } = this;
    return {
      width,
      height,
      sceneFunc,
      hitFunc
    };
  }).readOnly()

});
