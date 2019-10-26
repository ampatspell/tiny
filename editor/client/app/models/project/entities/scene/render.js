import Render, { editable } from '../entity/render';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const {
  freeze
} = Object;

export default Render.extend({

  expandable: true,

  inspectorTabs: freeze([
    { id: 'main', label: 'Scene', component: 'scene/main' }
  ]),

  deleteConfirmation: 'Sure you want to delete this scene?',

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

  absolute: readOnly('frame'),

  highlight: computed('model', function() {
    let { model } = this;
    return [ model ];
  }).readOnly(),

  editable: editable(),

  draggable: computed('isSpacePressed', 'hidden', 'model.isEditing', function() {
    let { isSpacePressed, hidden, model: { isEditing } } = this;
    return !isSpacePressed && !hidden && !isEditing;
  }).readOnly(),

  resizable: computed('isSpacePressed', 'locked', 'hidden', 'model.isEditing', function() {
    let { isSpacePressed, locked, hidden, model: { isEditing } } = this;
    return isSpacePressed && !locked && !hidden && isEditing;
  }).readOnly()

});
