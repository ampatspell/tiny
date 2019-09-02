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

  over: false,

  props: computed('x', 'y', function() {
    return Object.assign({ draggable: true }, this.getProperties('x', 'y'));
  }).readOnly(),

  isDark: gt('width', 75),

  fill: computed('width', 'over', function() {
    let { over, width } = this;
    let opacity = width / 100;
    if(over) {
      opacity = 1;
    }
    return `rgba(255,0,0,${opacity})`;
  }).readOnly(),

  description: computed('x', 'y', 'width', 'height', function() {
    let { x, y, width, height } = this;
    return `${x},${y},${width},${height}`;
  }).readOnly(),

  onDragmove(e) {
    if(e.target.component !== this) {
      return;
    }
    let { x, y } = this.nodeAttributes();
    this.update && this.update({ x, y });
  },

  actions: {
    over(over) {
      this.setProperties({ over });
    },
    click() {
      this.click && this.click(this);
    }
  }

});
