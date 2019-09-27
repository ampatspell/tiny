import Component from '../../-content';
import { readOnly } from '@ember/object/computed';

const length = key => readOnly(`model.${key}.models.length`);

export default Component.extend({
  classNameBindings: [ ':sprites-sprite' ],

  frames: length('frames'),
  loops: length('loops'),

});
