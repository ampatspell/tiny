import EmberObject, { computed } from '@ember/object';
import Konva from 'konva';

export default EmberObject.extend({

  nodeClassName: null,

  node: computed(function() {
    return this._createNode();
  }).readOnly(),

  init() {
    this._super(...arguments);
    this._startObserving();
  },

  nodeAttributesChanged(current, props) {
    return !!Object.keys(props).find(key => current[key] !== props[key]);
  },

  updateAttributes() {
    let { node, attributes } = this;
    if(!node) {
      return;
    }

    let current = node.getAttrs();
    if(!this.nodeAttributesChanged(current, attributes)) {
      return false;
    }

    node.setAttrs(attributes);
    return true;
  },

  setDirty() {
    let { parent } = this;
    if(parent) {
      parent.setDirty();
    }
  },

  updateAttributesAndSetDirty() {
    this.updateAttributes();
    this.setDirty();
  },

  // //

  // _didCreateNode(node) {
  //   let { parent } = this;
  //   if(parent) {
  //     parent._node.add(node);
  //   }
  // },

  // _didDestroyNode(node) {
  //   node.destroy();
  // },

  _createNode() {
    let { nodeClassName, attributes } = this;
    return new Konva[nodeClassName](attributes);
  },

  // _createNode() {
  //   let { _node } = this;
  //   if(!_node) {
  //     _node = this.__createNode();
  //     this.setProperties({ _node });
  //     this._didCreateNode(_node);
  //   }
  // },

  // _destroyNode() {
  //   let { _node } = this;
  //   if(_node) {
  //     this.setProperties({ _node: null });
  //     this._didDestroyNode(_node);
  //   }
  // },

  // //

  // mount() {
  //   if(this._mounted) {
  //     return;
  //   }
  //   this._createNode();
  //   this._properties.forEach(property => property.mount());
  //   this._startObserving();
  //   this.setProperties({ _mounted: true });
  //   this.setDirty();
  // },

  // unmount() {
  //   if(!this._mounted) {
  //     return;
  //   }
  //   this._stopObserving();
  //   this._properties.forEach(property => property.unmount());
  //   this._destroyNode();
  //   this.setProperties({ _mounted: false });
  // },

  // //

  _attributesDidChange() {
    this.updateAttributesAndSetDirty();
  },

  _startObserving() {
    this.addObserver('attributes', this, this._attributesDidChange);
  },

  _stopObserving() {
    this.removeObserver('attributes', this, this._attributesDidChange);
  },

  // //

  // _properties: computed(function() {
  //   return this._propertyKeys.map(key => this[key]);
  // }).readOnly(),

  // _propertyKeys: computed(function() {
  //   let arr = [];
  //   this.constructor.eachComputedProperty((key, meta) => {
  //     if(meta.konvaNodeProperty !== true) {
  //       return;
  //     }
  //     arr.push(key);
  //   });
  //   return arr;
  // }).readOnly(),

  willDestroy() {
    this._stopObserving();
    this._super(...arguments);
  }

});
