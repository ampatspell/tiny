import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-selection-layer' ],

  layer: readOnly('state.selection'),
  locked: readOnly('state.locked'),

  actions: {
    createNode() {
      this.state.createNode({
        type: 'fill',
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 8,
          height: 8
        },
        color: 'black'
      });
    },
    deleteLayer() {
      this.state.deleteLayer(this.layer);
    }
  }

});
