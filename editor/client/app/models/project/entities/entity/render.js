import Render from '../../-render';
import { or } from '@ember/object/computed';

export default Render.extend({

  hidden: or('model.hidden', 'model.parent.render.hidden'),
  locked: or('model.locked', 'model.parent.render.locked')

});
