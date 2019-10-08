import Render from '../../../entity/render';
import { computed } from '@ember/object';

export default Render.extend({

  inspectorTabs: computed('model.{type,typeName}', function() {
    let { model: { type, typeName } } = this;
    return [
      { id: 'main', label: typeName, component: `${type}/main` }
    ];
  })

});
