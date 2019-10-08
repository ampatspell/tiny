import Render from '../../entity/render';
import { computed } from '@ember/object';

export default Render.extend({

  expandable: true,

  inspectorTabs: computed('model.{type,baseTypeName}', function() {
    let { model: { type, baseTypeName } } = this;
    return [
      { id: 'main', label: baseTypeName, component: `${type}/main` }
    ];
  }),

});
