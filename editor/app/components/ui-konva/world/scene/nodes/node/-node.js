import Node from '../../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  scene: null,
  seneNode: null,
  pixel: null,

  position: computed('pixel', 'sceneNode.position', function() {
    let { pixel, sceneNode: { position: { x, y } } } = this;
    return {
      x: x * pixel,
      y: y * pixel
    };
  }).readOnly(),

  size: computed('pixel', 'sceneNode.size', function() {
    let { pixel, sceneNode: { size: { width, height} } } = this;
    return {
      width: width * pixel,
      height: height * pixel
    };
  }).readOnly()

});
