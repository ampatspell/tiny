import Node, { data } from '../node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  typeName: 'Sprite Node',

  alignment: data('alignment.serialized'),
  flip: data('flip.serialized'),

  _sprite: data('sprite'),
  sprites: readOnly('project.sprites.identified'),

  sprite: computed('_sprite', 'sprites.@each.identifier', function() {
    let { _sprite, sprites } = this;
    return sprites.findBy('identifier', _sprite);
  }).readOnly(),

});
