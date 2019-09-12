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
    let { size, draggable, node } = this;

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

    let { width, height } = size;
    let container = element.getElementsByClassName('content')[0];

    node = new Konva.Stage({
      container,
      width,
      height,
      draggable
    });

    node.component = this;

    this.addNodeEventListeners(node);
    this.set('node', node);

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
    let { size, draggable, node } = this;

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

    node.draggable(draggable);
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

  center() {
    let { node } = this;
    let rect = node.getClientRect();
    let position = node.position();
    let size = node.size();

    rect.x -= position.x;
    rect.y -= position.y;

    let calc = (p, s) => Math.floor((size[s] / 2) - (rect[s] / 2) - rect[p]);
    let x = calc('x', 'width');
    let y = calc('y', 'height');

    node.position({ x, y });
    node.batchDraw();
  },

  toDataURL() {
    let { node } = this;
    return node.toDataURL();
  },

});