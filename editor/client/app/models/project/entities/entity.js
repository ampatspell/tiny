import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { doc, data } from '../../-doc';

export {
  doc,
  data
}

export default EmberObject.extend(DocMixin, {

  project: null,
  doc: null,

  type: data('type'),
  baseType: readOnly('type'),

  _parent: data('parent'),

  entities: computed('project.content.models.@each._parent', 'id', function() {
    let { id, project: { content: { models } } } = this;
    return models.filter(model => model._parent === id);
  }).readOnly(),

  async load() {
  }

});
