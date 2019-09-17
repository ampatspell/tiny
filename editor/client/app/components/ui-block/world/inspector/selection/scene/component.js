import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const backgrounds = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'transparent', label: 'None' }
];

const choice = (arrayKey, valueKey) => computed(`arrayKey.@each.value`, valueKey, function() {
  let array = this.get(arrayKey);
  if(!array) {
    return;
  }
  let value = this.get(valueKey);
  return array.findBy('value', value);
}).readOnly();

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-selection-scene' ],

  scene: readOnly('state.selection'),
  locked: readOnly('scene.chainLocked'),

  backgrounds,
  background: choice('backgrounds', 'scene.background'),

  actions: {
    update(key, value) {
      this.scene.update({ [key]: value });
    },
    background({ value: background }) {
      this.scene.update({ background });
    },
    createGridLayer() {
      this.state.createLayer({
        type: 'grid',
        grid: { width: 8, height: 8 }
      });
    },
    createPixelLayer() {
      this.state.createLayer({
        type: 'pixel'
      });
    },
    moveUp() {
      this.scene.moveUp();
    },
    moveDown() {
      this.scene.moveDown();
    },
    deleteScene() {
      this.state.deleteScene(this.scene);
    }
  }

});
