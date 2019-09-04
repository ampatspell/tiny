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

  props: computed('frame', 'disabled', 'color', function() {
    let { frame, color, disabled } = this;
    return {
      ...frame,
      fill: '#fff',
      stroke: color,
      strokeWidth: 1,
      visible: !disabled,
      draggable: true
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
    let delta = this.clamp(this.toDelta());
    let props = this.fromDelta(delta);
    this.node.setAttrs(props);
  }

});
