import Node from '../../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  scene: null,
  layer: null,
  layerNode: null,
  pixel: null,

  position: computed('pixel', 'layerNode.position', function() {
    let { pixel, layerNode: { position: { x, y } } } = this;
    return {
      x: x * pixel,
      y: y * pixel
    };
  }).readOnly(),

  size: computed('pixel', 'layerNode.size', function() {
    let { pixel, layerNode: { size: { width, height} } } = this;
    return {
      width: width * pixel,
      height: height * pixel
    };
  }).readOnly()

});
