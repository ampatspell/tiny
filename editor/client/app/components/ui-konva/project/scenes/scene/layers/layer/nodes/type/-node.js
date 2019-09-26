import Node from '../../../../../../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  pixelFrame: readOnly('model.pixelFrame'),
  absolutePixel: readOnly('model.absolutePixel'),

  props: computed('pixelFrame', 'additionalProps', function() {
    let { pixelFrame, additionalProps } = this;
    additionalProps = additionalProps || {};
    return {
      ...pixelFrame,
      ...additionalProps
    };
  }).readOnly()

});
