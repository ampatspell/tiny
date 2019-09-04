import Node from '../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  props: computed('x', 'y', 'disabled', 'color', function() {
    let { x, y, color, disabled } = this;
    let s = 10;
    let hs = s / 2;
    return {
      x: x - hs,
      y: y - hs,
      width: s,
      height: s,
      fill: '#fff',
      stroke: color,
      strokeWidth: 1,
      visible: !disabled
    };
  }).readOnly(),

});
