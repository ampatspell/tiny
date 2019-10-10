import filteredEntities from '../../-filtered-entities';
import { normalized } from 'editor/utils/computed';

const Loops = filteredEntities('sprite/loop');

export default Loops.extend({

  _normalize(model) {
    return model || null;
  },

  selected: normalized('_normalize'),

  select(selected) {
    selected = this._normalize(selected);
    if(selected === this.selected) {
      return;
    }
    this.setProperties({ selected });
  }

});
