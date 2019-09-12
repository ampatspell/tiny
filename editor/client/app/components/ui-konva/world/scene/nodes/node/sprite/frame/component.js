import Component from '../-sprite';
import { readOnly } from '@ember/object/computed';

export default Component.extend({

  rendered: readOnly('layerNode.selected.preview.rendered'),

});
