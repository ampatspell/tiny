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
  locked: readOnly('state.locked'),

  backgrounds,
  background: choice('backgrounds', 'scene.background'),

  actions: {
    update(key, value) {
      this.scene.update({ [key]: value });
    },
    background({ value: background }) {
      this.scene.update({ background });
    },
    createLayer() {
      this.state.createLayer();
    },
    deleteScene() {
      this.state.deleteScene(this.scene);
    }
  }

});
