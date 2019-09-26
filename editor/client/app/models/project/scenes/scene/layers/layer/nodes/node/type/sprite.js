import Node, { data } from '../../node';
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

  _sprite: data('sprite'),
  sprites: readOnly('project.sprites.selectable'),

  size: computed('sprite.size', 'layer.grid', function() {
    let { sprite, layer: { grid } } = this;

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

  sprite: computed('_sprite', 'sprites.@each.identifier', function() {
    let { _sprite, sprites } = this;
    return sprites.findBy('identifier', _sprite);
  }).readOnly(),

  // onSprite({ identifier: sprite }) {
  //   if(!sprite) {
  //     return;
  //   }
  //   this.update({ sprite });
  // }

});
