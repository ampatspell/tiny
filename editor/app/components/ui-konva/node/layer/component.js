import Node from '../component';

export default Node.extend({

  createNode(Konva) {
    return new Konva.Layer();
  }

});
