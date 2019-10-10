import Render from '../entity/render';
import { computed } from '@ember/object';

export default Render.extend({

  inspectorTabs: computed('model.{type,typeName}', function() {
    let { model: { type, typeName } } = this;
    return [
      { id: 'main',  label: typeName, component: `${type}/main` },
      { id: 'frame', label: 'Frame',  component: `${type}/frame` },
      { id: 'loops', label: 'Loops',  component: `${type}/loops` },
      { id: 'loop',  label: 'Loop',   component: `${type}/loop` }
    ];
  }),

  detailsComponentName: 'sprites/sprite',

  deleteConfirmation: 'Sure you want to delete this sprite?'

});
