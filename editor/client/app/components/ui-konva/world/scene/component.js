import Node from '../../-node';
import { computed } from '@ember/object';

const observe = [ 'scene.position' ];

export default Node.extend({

  nodeClassName: 'group',
  observe,

  scene: null,
  pixel: null,

  draggable: computed('disabled', 'selection', 'scene', function() {
    let { disabled, selection, scene } = this;
    return !disabled && selection === scene;
  }).readOnly(),

  props: computed('pixel', 'scene.position', 'hidden', 'draggable', function() {
    let { pixel, scene: { position }, hidden, draggable } = this;
    return {
      x: position.x * pixel,
      y: position.y * pixel,
      visible: !hidden,
      listening: true,
      draggable
    };
  }),

  selectSelf() {
    this.select(this.scene);
  },

  selectParentSelf() {
    this.selectParent(this.scene);
  },

  updateSelf(props) {
    this.update(this.scene, props);
  },

  onClick(e) {
    e.cancelBubble = true;
    this.selectParentSelf();
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

    position = this.scene.clampPosition(position);

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