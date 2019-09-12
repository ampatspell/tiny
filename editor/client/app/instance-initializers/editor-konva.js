import konva from 'konva';

export default {
  name: 'editor:konva',
  initialize: () => {
    let getContext = konva.Canvas.prototype.getContext;
    konva.Canvas.prototype.getContext = function() {
      let context = getContext.call(this, arguments);
      context.imageSmoothingEnabled = false;
      return context;
    }
  }
};
