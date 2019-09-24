import EmberObject, { computed } from '@ember/object';
import Konva from 'konva';

export default EmberObject.extend({

  nodeClassName: null,
  node: null,
  models: null,

  createNode() {
    let { node } = this;
    if(node) {
      return;
    }
    let { nodeClassName, attributes } = this;
    console.log('createNode', nodeClassName, attributes);
    node = new Konva[nodeClassName](attributes);
    this.setProperties({ node });
    this.didCreateNode(node);
  },

  didCreateNode(node) {
    let { parent } = this;
    if(parent) {
      parent.didCreateChildNode(node);
    }
  },

  didCreateChildNode(node) {
    this.node.add(node);
  },

  bind() {
    this.createNode();
    this.definitionProperties.map(property => property.bind());
  },

  //

  definitionPropertyKeys: computed(function() {
    let keys = [];
    this.constructor.eachComputedProperty((key, meta) => {
      if(meta.isKonvaNodeDefinition !== true) {
        return;
      }
      keys.push(key);
    });
    return keys;
  }).readOnly(),

  definitionProperties: computed(function() {
    return this.definitionPropertyKeys.map(key => this[key]);
  }).readOnly(),

});
