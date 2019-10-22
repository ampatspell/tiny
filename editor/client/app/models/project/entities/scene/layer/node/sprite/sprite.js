import Node, { data } from '../node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export {
  data
}

const _size = Object.freeze({ width: 8, height: 8 });

export default Node.extend({

  typeName: 'Sprite Node',

  alignment: data('alignment.serialized'),
  flip: data('flip.serialized'),
  invert: data('invert'),
  omit: data('omit'),

  _sprite: data('sprite'),
  sprites: readOnly('project.sprites.identified'),

  sprite: computed('_sprite', 'sprites.@each.identifier', function() {
    let { _sprite, sprites } = this;
    return sprites.findBy('identifier', _sprite);
  }).readOnly(),

  size: computed('sprite.size', 'parent.grid', function() {
    let { sprite, parent: { grid } } = this;

    if(grid) {
      if(sprite) {
        let { size } = sprite;
        let calc = key => Math.ceil(size[key] / grid[key]) * grid[key];
        return {
          width: calc('width'),
          height: calc('height')
        };
      }
      return grid;
    }

    if(sprite) {
      let { size } = sprite;
      if(size) {
        return size;
      }
    }

    return _size;
  }).readOnly(),

  onSprite(sprite) {
    this.update({ sprite: sprite.identifier });
    return true;
  }

});
