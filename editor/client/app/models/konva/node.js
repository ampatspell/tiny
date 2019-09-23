import EmberObject, { computed } from '@ember/object';
import Konva from 'konva';

export default EmberObject.extend({

  nodeClassName: null,

  _node: null,

  __createNode() {
    let { nodeClassName, attributes } = this;
    return new Konva[nodeClassName](attributes);
  },

  _didCreateNode() {
    let { parent } = this;
    if(parent) {
      parent._node.add(this._node);
    }
  },

  _createNode() {
    let { _node } = this;
    if(!_node) {
      _node = this.__createNode();
      this.setProperties({ _node });
      this._didCreateNode();
    }
  },

  mount() {
    this._createNode();
    this._propertyKeys.map(key => {
      let property = this[key];
      property.mount();
    });
  },

  unmount() {

  },

  _propertyKeys: computed(function() {
    let arr = [];
    this.constructor.eachComputedProperty((key, meta) => {
      if(meta.konvaNodeProperty === true) {
        arr.push(key);
      }
    });
    return arr;
  }).readOnly(),

});
