import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';
import { model } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'sprites/sprite/frame',
  typeName: 'Frame',

  project: readOnly('frames.project'),
  sprite: readOnly('frames.sprite'),
  size: readOnly('sprite.size'),

  index: data('index'),
  identifier: data('identifier'),
  bytes: data('bytes'),

  properties: properties(),

  preview: model().named('project/sprites/sprite/frames/frame/preview').mapping(frame => ({ frame })),

  _previewRendered: readOnly('preview.rendered'),

  async load() {
  }

});
