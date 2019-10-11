import { computed } from '@ember/object';

export const isSelected = () => computed('project.selection.model', function() {
  return this.get('project.selection.model') === this;
}).readOnly();

export const selectedChildEntity = parentKey => computed(`project.selection.model.${parentKey}`, function() {
  let model = this.get('project.selection.model');
  if(model && model.get(parentKey) === this) {
    return this;
  }
}).readOnly();
