import Node from '../../-node';
import { computed } from '@ember/object';

const observe = [ 'scene.position' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  scene: null,
  pixel: null,

  props: computed('pixel', 'scene.position', function() {
    let { pixel, scene: { position } } = this;
    return {
      x: position.x * pixel,
      y: position.y * pixel,
      draggable: true
    };
  }),

  selectSelf() {
    this.select(this.scene);
  },

  updateSelf(props) {
    this.update(this.scene, props);
  },

  onClick(e) {
    e.cancelBubble = true;
    this.selectSelf();
  },

  onDragstart() {
    this.setProperties({ isDragging: true });
    this.selectSelf();
  },

  onDragmove() {
    if(!this.isDragging) {
      return;
    }

    let { x, y } = this.nodeAttributes();
    let { pixel } = this;

    let position = {
      x: Math.floor(x / pixel),
      y: Math.floor(y / pixel)
    };

    x = position.x * pixel;
    y = position.y * pixel;

    this.setNodeAttributes({ x, y });

    let current = this.pos;
    if(current && current.x === position.x && current.y === position.y) {
      return;
    }

    this.set('pos', position);
    this.updateSelf({ position });
  },

  onDragend() {
    this.setProperties({ isDragging: false, position: null });
  }

});
