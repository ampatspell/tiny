import Node from '../../node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'Text',

  attributes: computed('title.{value,show}', function() {
    let { title: { value, show } } = this;
    return {
      x: 10,
      y: 10,
      text: value,
      fontFamily: 'Roboto Mono',
      fontSize: 11,
      fill: 'rgba(0,0,0,0.9)',
      visible: show
    };
  }).readOnly(),

});
