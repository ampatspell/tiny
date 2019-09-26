import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  model: null,

  project: readOnly('model.project'),
  position: readOnly('model.position'),
  size: readOnly('model.size'),

  pixel: computed('project.pixel', 'model.pixel', function() {
    let { project, model } = this;
    return project.pixel * model.pixel;
  }).readOnly(),

  frame: computed('position', 'size', 'project.pixel', 'pixel', function() {
    let { position, size, project: { pixel: project }, pixel } = this;
    return {
      x: position.x * project,
      y: position.y * project,
      width: size.width * pixel,
      height: size.height * pixel
    };
  }).readOnly(),

  absolute: readOnly('frame'),

  selection: computed('model', function() {
    let { model } = this;
    return [ model ];
  }).readOnly()

});
