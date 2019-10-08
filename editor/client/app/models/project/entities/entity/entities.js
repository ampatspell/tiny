import Entities from '../../-entities';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const model = key => readOnly(`model.${key}`);

export default Entities.extend({

  model: null,

  id: model('id'),
  project: model('project'),

  models: computed('project.content.models.@each._parent', 'id', function() {
    let { id, project: { content: { models } } } = this;
    return models.filter(model => model._parent === id);
  }).readOnly()

});
