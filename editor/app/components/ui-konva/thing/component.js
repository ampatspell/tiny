import Node from '../-node';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';

export default Node.extend({

  createNode(Konva) {
    return new Konva.Group();
  },

  x: null,
  y: null,
  width: null,
  height: null,

  props: computed('x', 'y', function() {
    return this.getProperties('x', 'y');
  }).readOnly(),

  isDark: gt('width', 75),

  fill: computed('width', function() {
    let { width } = this;
    return `rgba(255,0,0,${width/100})`;
  }).readOnly(),

  description: computed('x', 'y', 'width', 'height', function() {
    let { x, y, width, height } = this;
    return `${x},${y},${width},${height}`;
  }).readOnly(),

});
