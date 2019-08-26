import Component from '@ember/component';
import Parent from '../-parent';
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

export default Component.extend(Parent, {
  classNameBindings: [ ':ui-block-konva-stage' ],

  size: null,
  node: null, // Konva.Stage

  didInsertElement() {
    this._super(...arguments);
    this.createNode();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.sizeDidChange();
  },

  willDestroyElement() {
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

    let { width, height } = size;
    let container = element.getElementsByClassName('content')[0];

    node = new Konva.Stage({
      container,
      width,
      height
    });

    setGlobal({ stage: node });

    this.set('node', node);
  },

  destroyNode() {
    let { node } = this;
    if(node) {
      this.set('node', null);
      node.destroy();
    }
  },

  //

  sizeDidChange() {
    let { size, node } = this;

    if(!node) {
      this.createNode();
      return;
    }

    if(!isSizeValid(size)) {
      return;
    }

    let { width, height } = size;

    if(width !== node.width()) {
      node.width(width);
    }

    if(height !== node.height()) {
      node.height(height);
    }
  }

});
