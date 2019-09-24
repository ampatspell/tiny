import Node from '../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  frame: computed('x', 'y', function() {
    let { x, y } = this;
    let s = 10;
    let hs = s / 2;
    return {
      x: x - hs,
      y: y - hs,
      width: s,
      height: s
    };
  }).readOnly(),

  hitFunc: computed(function() {
    let o = 20;
    let ho = o / 2;
    return (ctx, node) => {
      ctx.beginPath();
      ctx.rect(-ho, -ho, node.width() + o, node.height() + o);
      ctx.closePath();
      ctx.fillStrokeShape(node);
    }
  }).readOnly(),

  props: computed('frame', 'disabled', 'color', 'hitFunc', 'handle', 'key', function() {
    let { frame, color, disabled, hitFunc, handle, key } = this;
    let visible = !disabled && (!handle || handle === key);
    return {
      ...frame,
      fill: '#fff',
      stroke: color,
      strokeWidth: 1,
      draggable: true,
      visible,
      hitFunc
    };
  }).readOnly(),

  toDelta() {
    let { node, frame } = this;
    let attrs = node.getAttrs();
    let calc = key => attrs[key] - frame[key];
    return {
      x: calc('x'),
      y: calc('y')
    };
  },

  fromDelta(props) {
    let { frame } = this;
    let calc = key => frame[key] + props[key];
    return {
      x: calc('x'),
      y: calc('y')
    };
  },

  onDragmove() {
    let delta = this.clamp(this.key, this.toDelta());
    let props = this.fromDelta(delta);
    this.node.setAttrs(props);
  },

  onDragend() {
    let delta = this.toDelta();
    this.commit(this.key, delta);
  }

});
