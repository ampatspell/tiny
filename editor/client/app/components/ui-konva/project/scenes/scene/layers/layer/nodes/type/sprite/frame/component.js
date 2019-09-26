import Component from '../-node';
import { readOnly } from '@ember/object/computed';

export default Component.extend({

  rendered: readOnly('model.spriteFrame.preview.rendered')

});
