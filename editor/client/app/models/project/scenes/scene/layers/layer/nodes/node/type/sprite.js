import Node, { data } from '../../node';

export {
  data
}

// const _size = Object.freeze({ width: 8, height: 8 });

export default Node.extend({

  name: 'Sprite',

  // alignment: data('alignment.serialized'),
  // flip: data('flip.serialized'),

  // _sprite: data('sprite'),
  // _sprites: readOnly('layer.scene.world.worlds.project.sprites'),

  // size: computed('sprite.size', 'layer.grid', function() {
  //   let { sprite, layer: { grid } } = this;

  //   if(grid) {
  //     if(sprite) {
  //       let { size } = sprite;
  //       let calc = key => Math.ceil(size[key] / grid[key]) * grid[key];
  //       return {
  //         width: calc('width'),
  //         height: calc('height')
  //       };
  //     }
  //     return grid;
  //   }

  //   if(sprite) {
  //     let { size } = sprite;
  //     if(size) {
  //       return size;
  //     }
  //   }

  //   return _size;
  // }).readOnly(),

  // sprite: computed('_sprite', '_sprites.models.@each.identifier', function() {
  //   let { _sprite, _sprites } = this;
  //   if(!_sprite) {
  //     return;
  //   }
  //   return _sprites.models.findBy('identifier', _sprite);
  // }).readOnly(),

  // onSprite({ identifier: sprite }) {
  //   if(!sprite) {
  //     return;
  //   }
  //   this.update({ sprite });
  // }

});
