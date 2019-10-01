import Layer from '../../layer';

export default Layer.extend({

  typeName: 'Pixel Layer',

  clampNodePosition(node, position) {
    return this._super(node, position);
  }

});
