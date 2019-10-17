import { computed } from '@ember/object';

export const isSelected = () => computed('project.selection.model', function() {
  let model = this.get('project.selection.model');
  return model === this;
}).readOnly();

export const isEditing = () => computed('project.selection.editing', function() {
  // TODO: render.editable
  let model = this.get('project.selection.editing');
  return model === this && this.render.editable;
}).readOnly();

export const selectedChildEntity = parentKey => computed(`project.selection.model.${parentKey}`, function() {
  let model = this.get('project.selection.model');
  if(model && model.get(parentKey) === this) {
    return this;
  }
}).readOnly();
