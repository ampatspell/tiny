import Node from '../-node';

export default Node.extend({

  createNode(Konva) {
    return new Konva.Layer();
  }

});
