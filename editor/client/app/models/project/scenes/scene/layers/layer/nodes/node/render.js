import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  model: null,

  scene: readOnly('model.scene'),
  project: readOnly('model.project'),
  position: readOnly('model.position'),
  size: readOnly('model.size'),
  pixel: readOnly('project.pixel'),

  frame: computed('position', 'size', 'pixel', function() {
    let { position, size, pixel } = this;
    return {
      x: position.x * pixel,
      y: position.y * pixel,
      width: size.width * pixel,
      height: size.height * pixel
    };
  }).readOnly(),

  absolute: computed('scene.render.absolute', 'frame', function() {
    let { scene: { render: { absolute: scene } }, frame } = this;
    return {
      x: scene.x + frame.x,
      y: scene.y + frame.y,
      width: frame.width,
      height: frame.height
    };
  }).readOnly(),

  selection: computed('model', 'scene', function() {
    let { model, scene } = this;
    return [ model, scene ];
  }).readOnly(),

  selectionInset: -0.5

});
