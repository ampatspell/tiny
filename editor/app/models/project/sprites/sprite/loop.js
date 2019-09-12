import EmberObject, { computed } from '@ember/object';
import { readOnly, mapBy } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';
import { A } from '@ember/array';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  sprite: null,
  doc: null,

  identifier: data('identifier'),
  collapsed: data('collapsed'),

  indexes: data('indexes.serialized'),

  frames: computed('indexes', 'sprite.frames.@each.index', function() {
    let { indexes, sprite: { frames } } = this;
    if(!indexes) {
      return;
    }
    return A(indexes.map(index => frames.findBy('index', index))).compact();
  }).readOnly(),

  _framesPreviewRendered: mapBy('frames', '_previewRendered'),

  async load() {
  },

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  }

});
