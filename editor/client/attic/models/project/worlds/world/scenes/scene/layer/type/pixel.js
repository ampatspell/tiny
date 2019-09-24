import Layer from '../layer';

export default Layer.extend({

  name: 'Pixel',

  clampNodePosition(node, position) {
    return position;
  }

});
