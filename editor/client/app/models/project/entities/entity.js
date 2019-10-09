import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { doc, data } from '../../-doc';
import { entities } from '../-entities';
import { render as _render } from '../-render';

const render = name => _render(`project/entities/${name}`);

export {
  doc,
  data,
  render
}

const parent = () => computed('project.content.models.@each.id', '_parent', function() {
  let { _parent, project } = this;
  if(_parent === null) {
    return project;
  }
  return project.content.models.findBy('id', _parent);
}).readOnly();

const selected = () => computed('project.selection.model', function() {
  return this.project.selection.model === this;
}).readOnly();

export default EmberObject.extend(DocMixin, {

  project: null,
  doc: null,

  selected: selected(),

  type: data('type'),
  baseType: readOnly('type'),

  position: data('position.serialized'),
  size: data('size.serialized'),
  _parent: data('parent'),

  parent: parent(),

  entities: entities('project/entities/entity'),

  async load() {
  }

});
