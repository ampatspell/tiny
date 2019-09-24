import Node from '../../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',
  observe: Object.freeze([ 'layerNode.position', 'layerNode.size' ]),

  scene: null,
  layer: null,
  layerNode: null,
  pixel: null,

  position: computed('pixel', 'layerNode.position', function() {
    let { pixel, layerNode: { position } } = this;
    if(!position) {
      return;
    }
    let { x, y } = position;
    return {
      x: x * pixel,
      y: y * pixel
    };
  }).readOnly(),

  size: computed('pixel', 'layerNode.size', function() {
    let { pixel, layerNode: { size } } = this;
    if(!size) {
      return;
    }
    let { width, height } = size;
    return {
      width: width * pixel,
      height: height * pixel,
    };
  }).readOnly(),

  customProps: null,

  props: computed('zIndex', 'position', 'disabled', 'customProps', 'hidden', function() {
    let { zIndex, position, disabled, customProps, hidden } = this;
    if(!position) {
      return;
    }
    customProps = customProps || {};
    return {
      zIndex,
      ...customProps,
      ...position,
      draggable: true,
      visible: !hidden,
      listening: !disabled
    };
  }).readOnly(),

  onClick(e) {
    e.cancelBubble = true;
    this.selectSelf();
  },

  selectSelf() {
    this.select(this.layerNode);
  },

  updateSelf(props) {
    this.update(this.layerNode, props);
  },

  onDragstart(e) {
    e.cancelBubble = true;
    this.setProperties({ isDragging: true });
    this.selectSelf();
  },

  onDragmove(e) {
    if(!this.isDragging) {
      return;
    }

    e.cancelBubble = true;

    let { x, y } = this.nodeAttributes();
    let { pixel } = this;

    let position = {
      x: Math.floor(x / pixel),
      y: Math.floor(y / pixel)
    };

    position = this.layerNode.clampPosition(position);

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

  onDragend(e) {
    if(!this.isDragging) {
      return;
    }
    e.cancelBubble = true;
    this.setProperties({ isDragging: false, _dragPosition: null });
  }

});
