import Layer from '../../layer';

export default Layer.extend({

  name: 'Pixel Layer',

  clampNodePosition(node, position) {
    return position;
  }

});
