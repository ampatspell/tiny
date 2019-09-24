import EmberObject, { computed } from '@ember/object';
import Konva from 'konva';

export default EmberObject.extend({

  nodeClassName: null,

  _node: null,
  _mounted: false,

  //

  _updateAttributes() {
    let { _node, attributes } = this;
    if(!_node) {
      return;
    }
    _node.setAttrs(attributes);
    this.setDirty();
  },

  setDirty() {
    let { parent } = this;
    if(parent) {
      parent.setDirty();
    }
  },

  //

  _didCreateNode(node) {
    let { parent } = this;
    if(parent) {
      parent._node.add(node);
    }
  },

  _didDestroyNode(node) {
    node.destroy();
  },

  __createNode() {
    let { nodeClassName, attributes } = this;
    return new Konva[nodeClassName](attributes);
  },

  _createNode() {
    let { _node } = this;
    if(!_node) {
      _node = this.__createNode();
      this.setProperties({ _node });
      this._didCreateNode(_node);
    }
  },

  _destroyNode() {
    let { _node } = this;
    if(_node) {
      this.setProperties({ _node: null });
      this._didDestroyNode(_node);
    }
  },

  //

  mount() {
    if(this._mounted) {
      return;
    }
    this._createNode();
    this._properties.forEach(property => property.mount());
    this._startObserving();
    this.setProperties({ _mounted: true });
    this.setDirty();
  },

  unmount() {
    if(!this._mounted) {
      return;
    }
    this._stopObserving();
    this._properties.forEach(property => property.unmount());
    this._destroyNode();
    this.setProperties({ _mounted: false });
  },

  //

  _attributesDidChange() {
    this._updateAttributes();
  },

  _startObserving() {
    this.addObserver('attributes', this, this._attributesDidChange);
  },

  _stopObserving() {
    this.removeObserver('attributes', this, this._attributesDidChange);
  },

  //

  _properties: computed(function() {
    return this._propertyKeys.map(key => this[key]);
  }).readOnly(),

  _propertyKeys: computed(function() {
    let arr = [];
    this.constructor.eachComputedProperty((key, meta) => {
      if(meta.konvaNodeProperty !== true) {
        return;
      }
      arr.push(key);
    });
    return arr;
  }).readOnly(),

});
