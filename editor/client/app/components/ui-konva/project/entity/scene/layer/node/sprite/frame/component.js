import Sprite from '../-sprite';
import { readOnly } from '@ember/object/computed';

export default Sprite.extend({

  rendered: readOnly('model.spriteFrame.preview.rendered')

});
