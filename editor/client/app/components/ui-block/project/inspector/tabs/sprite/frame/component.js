import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({

  frame: readOnly('model.frames.selected'),

});
