import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { doc, data } from '../../-doc';
import { entities } from '../-entities';

export {
  doc,
  data
}

const parent = () => computed('project.content.models.@each.id', '_parent', function() {
  let { _parent, project } = this;
  if(_parent === null) {
    return project;
  }
  return project.content.models.findBy('id', _parent);
}).readOnly();

export default EmberObject.extend(DocMixin, {

  project: null,
  doc: null,

  type: data('type'),
  baseType: readOnly('type'),

  _parent: data('parent'),
  parent: parent(),

  entities: entities('project/entities/entity'),

  async load() {
  }

});
