import Node from '../../-node';
import { computed } from '@ember/object';

const observe = [ 'scene.position' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  scene: null,
  pixel: null,

  props: computed('pixel', 'scene.position', 'draggable', function() {
    let { pixel, scene: { position }, draggable } = this;
    return {
      x: position.x * pixel,
      y: position.y * pixel,
      draggable
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

    let current = this._dragPosition;
    if(current && current.x === position.x && current.y === position.y) {
      return;
    }

    this.set('_dragPosition', position);
    this.updateSelf({ position });
  },

  onDragend() {
    this.setProperties({ isDragging: false, _dragPosition: null });
  }

});
