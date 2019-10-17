import Render, { editable } from '../entity/render';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Render.extend({

  inspectorTabs: computed('model.{type,typeName}', function() {
    let { model: { type, typeName } } = this;
    return [
      { id: 'main',  label: typeName, component: `${type}/main` },
      { id: 'frame', label: 'Frame',  component: `${type}/frame` },
      { id: 'loops', label: 'Loops',  component: `${type}/loops` },
      { id: 'loop',  label: 'Loop',   component: `${type}/loop` }
    ];
  }),

  detailsComponentName: 'sprites/sprite',

  deleteConfirmation: 'Sure you want to delete this sprite?',

  modelPixel: readOnly('model.pixel'),
  projectPixel: readOnly('model.project.pixel'),

  pixel: computed('modelPixel', 'projectPixel', function() {
    let { modelPixel, projectPixel } = this;
    return modelPixel * projectPixel;
  }).readOnly(),

  frame: computed('model.{position,size}', 'modelPixel', 'projectPixel', function() {
    let { model: { position: { x, y }, size: { width, height } }, projectPixel, pixel } = this;
    return {
      x: x * projectPixel,
      y: y * projectPixel,
      width: width * pixel,
      height: height * pixel
    };
  }).readOnly(),

  absolute: readOnly('frame'),

  highlight: computed('model', function() {
    let { model } = this;
    return [ model ];
  }).readOnly(),

  editable: editable(),

  draggable: computed('locked', 'hidden', 'model.isEditing', function() {
    let { locked, hidden, model: { isEditing } } = this;
    return !locked && !hidden && !isEditing;
  }).readOnly(),

});
