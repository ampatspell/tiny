import Component from '@ember/component';
import Parent from '../-parent';
import StageEvents from '../-events';
import Konva from 'konva';

const isSizeValid = size => {
  if(!size) {
    return false;
  }
  let { width, height } = size;

  if(!width || !height) {
    return false;
  }

  return true;
}

export default Component.extend(Parent, StageEvents, {
  classNameBindings: [ ':ui-konva-stage' ],

  size: null,
  origin: null,
  draggable: true,
  node: null, // Konva.Stage

  didInsertElement() {
    this._super(...arguments);
    this.createNode();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.propertiesDidChange();
  },

  willDestroyElement() {
    this.destroying && this.destroying(this);
    this.destroyNode();
    this._super(...arguments);
  },

  createNode() {
    let { size, node } = this;

    if(node) {
      return;
    }

    if(!isSizeValid(size)) {
      return;
    }

    let element = this.element;
    if(!element) {
      return;
    }

    let container = element.getElementsByClassName('content')[0];

    node = new Konva.Stage({
      container
    });

    node.component = this;
    this.addNodeEventListeners(node);
    this.setProperties({ node });
    this.propertiesDidChange();
    this.created && this.created(this);
  },

  destroyNode() {
    let { node } = this;
    if(node) {
      this.set('node', null);
      node.destroy();
    }
  },

  //

  propertiesDidChange() {
    let { size, origin, draggable, node } = this;

    if(!node) {
      this.createNode();
      return;
    }

    if(isSizeValid(size)) {
      let { width, height } = size;
      if(width !== node.width()) {
        node.width(width);
      }
      if(height !== node.height()) {
        node.height(height);
      }
    }

    if(origin) {
      node.position(origin);
    }

    node.draggable(draggable);
    node.batchDraw();
  },

  //

  getLayerComponents() {
    let { node } = this;
    if(!node) {
      return;
    }
    let layers = node.getLayers();
    return layers.map(layer => layer.component);
  },

  toDataURL() {
    let { node } = this;
    return node.toDataURL();
  },

  //

  onDragstart() {
    this.setProperties({ isDragging: true });
    this.dragStart && this.dragStart();
  },

  onDragmove() {
    if(!this.isDragging) {
      return;
    }
    let origin = this.node.position();
    this.update({ origin });
  },

  onDragend() {
    this.setProperties({ isDragging: false });
    this.dragEnd && this.dragEnd();
  },

});
