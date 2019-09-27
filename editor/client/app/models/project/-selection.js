import { computed } from '@ember/object';

export const selected = () => computed('project.selection', function() {
  return this.project.selection === this;
}).readOnly();

export const editing = () => computed('project.editing', function() {
  return this.project.editing === this;
}).readOnly();

export const selectedChild = (parentKey, typeKey) => {
  let dep = `project.selection.${parentKey}`;
  if(typeKey) {
    dep = `${dep}.${typeKey}`;
  }
  return computed(dep, function() {
    let { project: { selection } } = this;
    if(!selection) {
      return;
    }
    if(selection.get(parentKey) !== this) {
      return;
    }
    if(typeKey && selection.get(typeKey) !== true) {
      return;
    }
    return selection;
  }).readOnly();
}
