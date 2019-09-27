import Node, { data } from '../../node';

export default Node.extend({

  typeName: 'Fill Node',

  color: data('color'),
  size: data('size.serialized')

});
