import Node from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const mapping = {
  'red':   'rgba(255, 102, 97, 0.4)',
  'green': 'rgba(97, 255, 123, 0.5)',
  'black': '#000',
  'white': '#fff'
};

const observe = [ '_frame', 'fill' ];

export default Node.extend({

  nodeClassName: 'rect',
  observe,

  color: readOnly('model.color'),

  fill: computed('model.color', function() {
    return mapping[this.model.color];
  }).readOnly(),

  props: computed('_frame', 'fill', function() {
    let { _frame: { width, height }, fill } = this;
    return  {
      width,
      height,
      fill
    }
  }).readOnly()

});
