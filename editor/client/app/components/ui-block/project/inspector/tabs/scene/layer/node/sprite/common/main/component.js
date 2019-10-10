import Component from '../../../../../../-component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  sprites: computed('model.sprites.@each.identifier', function() {
    return this.model.sprites.map(({ identifier }) => ({
      identifier,
      label: identifier
    }));
  }).readOnly(),

  sprite: computed('model.sprite.identifier', 'sprites.@each.identifier', function() {
    let sprite = this.model.sprite;
    if(!sprite || !sprite.identifier) {
      return;
    }
    return this.sprites.findBy('identifier', sprite.identifier);
  }).readOnly(),

  actions: {
    sprite({ identifier }) {
      this.update('sprite', identifier);
    }
  }

});
