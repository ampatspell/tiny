import Layer, { data } from './layer';

export default Layer.extend({

  typeName: 'Grid Layer',

  grid: data('grid.serialized')

});
