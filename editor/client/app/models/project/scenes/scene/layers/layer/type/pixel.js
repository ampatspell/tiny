import Layer from '../../layer';

export default Layer.extend({

  typeName: 'Pixel Layer',

  clampNodePosition(node, position) {
    return position;
  }

});
