import EmberObject from '@ember/object';
import { or } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from '../../../../-doc';

export default EmberObject.extend(DocMixin, {

  layers: null,
  doc: null,

  type: data('type'),
  index: data('index'),
  identifier: data('identifier'),

  collapsed: data('collapsed'),
  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('layers.chainHidden', 'hidden'),
  chainLocked: or('layers.chainLocked', 'locked'),

  nodes: model().named('project/scenes/scene/layers/layer/nodes').mapping(layer => ({ layer })),

  async load({ type }) {
    if(type === 'detail') {
      await this.nodes.load({ type });
    }
  }

});
