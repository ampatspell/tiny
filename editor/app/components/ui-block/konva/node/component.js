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

  drawParent() {
    let { node } = this;
    node.parent && node.parent.draw();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.updateNodeAttributes();
    this.drawParent();
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
