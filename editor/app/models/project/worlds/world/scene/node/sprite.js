import Node from './node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const data = path => readOnly(`doc.data.${path}`);

export default Node.extend({

  name: 'Sprite',

  alignment: data('alignment.serialized'),

  _sprite: data('sprite'),
  _sprites: readOnly('layer.scene.world.worlds.project.sprites'),

  size: computed('sprite.size', 'layer.grid', function() {
    let { sprite, layer: { grid } } = this;
    if(sprite) {
      let { size } = sprite;
      if(size) {
        return size;
      }
    }
    if(grid) {
      return grid;
    }
    return { width: 8, height: 8 };
  }).readOnly(),

  sprite: computed('_sprite', '_sprites.models.@each.identifier', function() {
    let { _sprite, _sprites } = this;
    if(!_sprite) {
      return;
    }
    return _sprites.models.findBy('identifier', _sprite);
  }).readOnly(),

  onSprite({ identifier: sprite }) {
    if(!sprite) {
      return;
    }
    this.update({ sprite });
  }

});
