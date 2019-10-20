import Render, { absolute } from '../../entity/render';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Render.extend({

  expandable: true,

  inspectorTabs: computed('model.{type,baseTypeName}', function() {
    let { model: { type, baseTypeName } } = this;
    return [
      { id: 'main', label: baseTypeName, component: `${type}/main` }
    ];
  }),

  deleteConfirmation: 'Sure you want to delete this layer?',

  pixel: readOnly('model.project.pixel'),

  frame: computed('model.{position,size}', 'pixel', function() {
    let { model: { position: { x, y }, size }, pixel } = this;
    let { width, height } = size;
    return {
      x: x * pixel,
      y: y * pixel,
      width: width * pixel,
      height: height * pixel
    };
  }).readOnly(),

  absolute: absolute(),

  highlight: readOnly('model.scene.render.highlight')

});
