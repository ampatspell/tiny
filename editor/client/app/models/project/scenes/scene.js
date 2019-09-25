import EmberObject from '@ember/object';
import { or } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from '../../-doc';

export default EmberObject.extend(DocMixin, {

  scenes: null,
  doc: null,

  index: data('index'),
  name: data('name'),
  identifier: data('identifier'),
  position: data('position.serialized'),
  size: data('size.serialized'),
  background: data('background'),

  collapsed: data('collapsed'),
  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('scenes.chainHidden', 'hidden'),
  chainLocked: or('scenes.chainLocked', 'locked'),

  layers: model().named('project/scenes/scene/layers').mapping(scene => ({ scene })),

  async load({ type }) {
    if(type === 'detail') {
      await this.layers.load({ type });
    }
  }

});
