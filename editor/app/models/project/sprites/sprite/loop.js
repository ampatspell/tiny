import EmberObject, { computed } from '@ember/object';
import { readOnly, mapBy } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';
import { A } from '@ember/array';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  sprite: null,
  doc: null,

  locked: readOnly('sprite.locked'),

  identifier: data('identifier'),
  collapsed: data('collapsed'),
  _frames: data('frames.serialized'),

  frames: computed('_frames', 'sprite.frames.@each.id', function() {
    let { _frames: ids, sprite: { frames } } = this;
    if(!ids) {
      return;
    }
    return A(ids.map(id => frames.findBy('id', id))).compact();
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

  _withFrames(cb) {
    let frames = A(this._frames).slice();
    cb(frames);
    this.update({ frames });
  },

  addFrame(frame) {
    if(!frame) {
      return;
    }
    let { id } = frame;
    this._withFrames(frames => frames.push(id));
  },

  removeFrameAtIndex(idx) {
    this._withFrames(frames => frames.removeAt(idx));
  },

  //

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  }

});
