import Node from './node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const data = path => readOnly(`doc.data.${path}`);

export default Node.extend({

  name: 'Sprite',

  _id: data('sprite'),
  _sprites: readOnly('layer.scene.world.worlds.project.sprites'),

  size: computed('sprite.size', 'layer.scene.grid', function() {
    return this.get('sprite.size') || this.get('layer.scene.grid');
  }).readOnly(),

  sprite: computed('_id', '_sprites.models.@each.id', function() {
    let { _id, _sprites } = this;
    if(!_id) {
      return;
    }
    return _sprites.models.findBy('id', _id);
  }).readOnly(),

});
