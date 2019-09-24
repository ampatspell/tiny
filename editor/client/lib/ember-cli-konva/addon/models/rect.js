import Node from './node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'Rect',

  attributes: computed('props.{x,y,fill}', function() {
    let { props: { x, y, fill } } = this;
    return {
      x,
      y,
      width: 50,
      height: 50,
      fill
    };
  })

});
