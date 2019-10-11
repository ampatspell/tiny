import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  // model: null,

  // project: readOnly('model.project'),
  // position: readOnly('model.position'),
  // size: readOnly('model.size'),
  // pixel: readOnly('project.pixel'),

  // frame: computed('position', 'size', 'pixel', function() {
  //   let { position, size, pixel } = this;
  //   return {
  //     x: position.x * pixel,
  //     y: position.y * pixel,
  //     width: size.width * pixel,
  //     height: size.height * pixel
  //   };
  // }).readOnly(),

  // absolute: readOnly('frame'),

  selection: computed('model', function() {
    let { model } = this;
    return [ model ];
  }).readOnly(),

  resizable: true

});
