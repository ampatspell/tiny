import Mixin from '@ember/object/mixin';

export default Mixin.create({

  isDragging: false,
  _dragPosition: null,

  onDragstart() {
    this.setProperties({ isDragging: true });
    this.selectSelf();
  },

  onDragmove() {
    if(!this.isDragging) {
      return;
    }

    let { x, y } = this.nodeAttributes();
    let { project: { pixel } } = this;

    let position = {
      x: Math.floor(x / pixel),
      y: Math.floor(y / pixel)
    };

    position = this.clampPosition(position);

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
