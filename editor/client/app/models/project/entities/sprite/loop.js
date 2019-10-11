import Entity, { data } from '../entity';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { properties } from '../../properties';

export default Entity.extend({

  typeName: 'Sprite Loop',

  sprite: readOnly('parent'),
  size: readOnly('sprite.size'),

  properties: properties(),

  _frames: data('frames.serialized'),

  frames: computed('_frames.[]', 'sprite.frames.models.@each.id', function() {
    let { _frames: ids, sprite: { frames: { models } } } = this;
    if(!ids) {
      return;
    }
    return ids.map(id => models.findBy('id', id));
  }).readOnly(),

  previewRendered: computed('frames.@each.previewRendered', function() {
    let { frames } = this;
    if(!frames) {
      return;
    }
    return frames.map(frame => frame && frame.previewRendered);
  }).readOnly(),

});