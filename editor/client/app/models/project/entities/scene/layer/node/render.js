import Render, { absolute } from '../../../entity/render';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Render.extend({

  inspectorTabs: computed('model.{type,baseTypeName}', function() {
    let { model: { type, baseTypeName } } = this;
    return [
      { id: 'main', label: baseTypeName, component: `${type}/main` }
    ];
  }),

  pixel: readOnly('model.project.pixel'),

  frame: computed('model.{position,size}', 'pixel', function() {
    let { model: { position: { x, y }, size: { width, height } }, pixel } = this;
    return {
      x: x * pixel,
      y: y * pixel,
      width: width * pixel,
      height: height * pixel
    };
  }).readOnly(),

  absolute: absolute(),

  highlightInset: -0.5,

  highlight: computed('model.scene', function() {
    let { model, model: { scene } } = this;
    return [ scene, model ];
  }).readOnly(),

  editable: readOnly('model.scene.render.editable'),

  draggable: computed('isSpacePressed', 'locked', 'hidden', 'model.scene.isEditing', function() {
    let { isSpacePressed, locked, hidden, model: { scene } } = this;
    return !isSpacePressed && !locked && !hidden && scene.isEditing;
  }).readOnly()

});
