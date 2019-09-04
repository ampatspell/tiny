import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

const frame = key => readOnly(`frame.${key}`);

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-frame-editor' ],

  size: frame('size'),
  bytes: frame('bytes')

});
