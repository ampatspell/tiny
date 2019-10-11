import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { doc, data } from '../../-doc';
import { entities } from '../-entities';
import { render as _render } from '../-render';
import { isSelected } from '../-selection';

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

export default EmberObject.extend(DocMixin, {

  project: null,
  doc: null,

  type: data('type'),
  baseType: readOnly('type'),

  position: data('position.serialized'),
  size: data('size.serialized'),

  _parent: data('parent'),
  parent: parent(),

  isSelected: isSelected(),

  entities: entities('project/entities/entity'),

  _renderAbsolute: readOnly('render.absolute'),

  async load() {
  },

  //

  select() {
    return this.project.select(this);
  },

  //

  clampPosition(position) {
    return position;
  },

  //

  moveUp() {
    let { parent } = this;
    if(!parent) {
      return;
    }
    parent.entities.moveUp(this);
  },

  moveDown() {
    let { parent } = this;
    if(!parent) {
      return;
    }
    parent.entities.moveDown(this);
  },

  //

  async willDelete() {
    await this.project.willDeleteEntity(this);
  },

});
