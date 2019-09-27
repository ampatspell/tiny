import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';
import { model } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'sprites/sprite/loop',
  typeName: 'Loop',
  baseTypeName: 'Loop',

  loops: null,
  project: readOnly('loops.project'),
  sprite: readOnly('loops.sprite'),

  identifier: data('identifier'),
  _frames: data('frames'),

  properties: properties(),

  render: model().named('project/sprites/sprite/loops/loop/render').mapping(model => ({ model })),

  frames: computed('_frames', 'sprite.frames.models.@each.id', function() {
    let { _frames: ids, sprite: { frames: { models } } } = this;
    if(!ids) {
      return;
    }
    return ids.map(id => models.findBy('id', id));
  }).readOnly(),

  _framesPreviewRendered: computed('frames.@each._previewRendered', function() {
    let { frames } = this;
    if(!frames) {
      return;
    }
    return frames.map(frame => frame && frame._previewRendered);
  }).readOnly(),

  async load() {
  }

});
