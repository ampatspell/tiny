import Component from '@ember/component';
import Parent from '../-parent';
import { computed } from '@ember/object';
import Konva from 'konva';

export default Component.extend(Parent, {
  tagName: '',

  props: null,

  node: computed(function() {
    return this.createNode(Konva);
  }).readOnly(),

  updateNodeAttributes() {
    let { node, props } = this;
    node.setAttrs(props);
  },

  drawLayer() {
    let layer = this.node.getLayer();
    layer && layer.batchDraw();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.updateNodeAttributes();
    this.drawLayer();
  },

  didInsertElement() {
    this._super(...arguments);
    this.parent.registerChildComponent(this);
  },

  willDestroyElement() {
    this.parent.unregisterChildComponent(this);
    this._super(...arguments);
  }

});
